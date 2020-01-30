import { Component, OnInit, Input, RootRenderer } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from '../../services/api.service';
import { Document } from '../../modules/document';
import { ClinicalCase } from '../../modules/clinicalCase';
import { Version } from '../../modules/version';



@Component({
  selector: 'app-clinical-case',
  templateUrl: './clinical-case.component.html',
  styleUrls: ['./clinical-case.component.css']
})



export class clinicalCase implements OnInit {
  title = "Clinical case"
  radioBoxValues: string[] = ["yes", "no"]

  docType: string = null;
  document: Document = null;
  selectedCase: ClinicalCase = null;
  selectedCaseVersion: Version = null;
  canModify = true;
  auxText: string = null;


  constructor(
    private _snackBar: MatSnackBar,
    private dataShareService: DataShareService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.observeDocumentType();
    this.observeDocument();
  }

  observeDocumentType() {
    this.dataShareService.observeDocumentType().subscribe(result => {
      this.docType = result;
    });
  }


  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      if (result) {
        this.document = result;
        this.arrangeView();
      }
    })
  }

  arrangeView() {
    this.selectedCase = this.document.$clinical_cases[this.document.$clinical_cases.length - 1];
    console.log(this.selectedCase);

    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
    this.auxText = this.selectedCaseVersion.$clinical_case;
  }

  onCaseChange(event) {
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
    this.auxText = this.selectedCaseVersion.$clinical_case;

  }

  onVersionChange(event) {
    this.selectedCaseVersion = event.value;
    this.auxText = this.selectedCaseVersion.$clinical_case;
    if (this.selectedCaseVersion != this.selectedCase.$newCaseVersion) {
      this.canModify = false;
    } else {
      this.canModify = true;
    }
  }

  onChangeText(event) {
    var version = null;
    var text = "";
    if (event)
      text = event.trim()
    this.selectedCase.$newCaseVersion.$clinical_case = text;

    if (this.selectedCase.$versions) {
      version = this.selectedCase.$versions.find((v) => v.$clinical_case.toLowerCase() == text.toLowerCase());
    }

    this.selectedCaseVersion = version ? version : this.selectedCase.$newCaseVersion;;

  }

  newCase() {
    var isNew = this.document.$clinical_cases.find((cases) => cases.$isNew == true);

    if (!isNew) {
      this.document.$clinical_cases.push(new ClinicalCase().deserialize({ isNew: true }))
      this.selectedCase = this.document.$clinical_cases[this.document.$clinical_cases.length - 1]
    }

  }

  onSubmit() {
    const style = ["error-snack-bar"]

    this.selectedCase.$isNew = null;


    if (this.selectedCaseVersion == this.selectedCase.$newCaseVersion) {
      var now = Date.now();
      
      var jsonToSubmit = {
        _id: this.selectedCase.$_id,
        yes_no: this.selectedCase.$newCaseVersion.$yes_no,
        clinical_case: this.selectedCase.$newCaseVersion.$clinical_case,
        time: now,
        source_id: this.document.$_id,
        user_id: null
      }

      this.apiService.addClinicalCase(jsonToSubmit, this.docType).subscribe(result => {
        this.selectedCase.$versions = result.$versions;

       
        this.openSnackBar("Added successfully", "OK");
      });
    } else {
      this.openSnackBar("Error: You must select actual version of case.", "OK", style);
    }
  }

  openSnackBar(message: string, action: string = null, style = ['snackbar-style']) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: style
    });
  }
}
//----------------------------

//     if (Array.isArray(this.document.clinical_cases)) {
//       console.log("ss");
//       var exist_new = (this.document.clinical_cases.filter((v) => v['new'])).find(bool => bool = true);
//       if (!exist_new) {
//         this.apiService.createNewCase(this.document._id).subscribe(result => {
//           this.document.clinical_cases.push(result)
//           this.clinical_case = this.document.clinical_cases[this.document.clinical_cases.length - 1];
//         });
//       }
//     } else {
//       this.apiService.createNewCase(this.document._id).subscribe(result => {
//         this.document.clinical_cases = [result]
//         this.clinical_case = this.document.clinical_cases[0]
//       });
//     }
//   }


//   submitData() {
//     ` TODO -> add time and meta_data into the sending object`

//     const style = ["error-snack-bar"]

//     if (!this.selected_version || this.selected_version == -1) {
//       console.log(this.clinical_case);

//       var now = Date.now();
//       this.clinical_case.time = now;
//       this.clinical_case["yes_no"] = this.radioSelected;
//       this.apiService.addClinicalCase(this.clinical_case, this.selected_type).subscribe(result => {
//         this.clinical_case.versions = result.versions;

//         console.log(result);

//         this.selected_version = this.clinical_case.versions[this.clinical_case.versions.length - 1]
//         this.openSnackBar("Added successfuly", "OK");
//       });
//     }
//   }


//   openSnackBar(message: string, action: string = null, style = ['snackbar-style']) {
//     this._snackBar.open(message, action, {
//       duration: 2000,
//       panelClass: style
//     });
//   }


//----------------------------

  // getPathParams() {
  //   this.route.root.children.map(param =>
  //     param.paramMap.subscribe(param => {
  //       var link = param.get("type");
  //       var type = param.get("link");
  //     }))
  // }
