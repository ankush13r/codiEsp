import { Component, OnInit, Input, RootRenderer } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from '../../services/api.service';
import { Document } from '../../modules/document';
import { ClinicalCase } from '../../modules/clinicalCase';
import { Version } from '../../modules/version';



@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css']
})



export class clinicalCase implements OnInit {
  title = "Clinical case"
  radioBoxValues: string[] = ["yes", "no"]

  docType: string = null;
  document: Document = null;
  selectedCase: ClinicalCase = null;
  selectedCaseVersion: Version = null;
  auxText: string = null;

  constructor(
    private _snackBar: MatSnackBar,
    private dataShareService: DataShareService,
    private apiService: ApiService,
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
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;

  }


  onCaseChange(event) {
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
    this.auxText = this.selectedCaseVersion.$clinical_case;
  }

  onVersionChange(event) {
    this.selectedCaseVersion = event.value;
    this.auxText = this.selectedCaseVersion.$clinical_case;

  }

  onChangeText(event) {
 
      this.showTarget();
    
  }
  onModify() {
    this.selectedCase.$newCaseVersion.$clinical_case = this.selectedCaseVersion.$clinical_case;
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
  }


  findEqualVersion = (text) => this.selectedCase.$versions.find((v) => v.$clinical_case.toLowerCase() == text.toLowerCase());

  newCase() {
    var isNew = this.document.$clinical_cases.find((cases) => cases.$isNew == true);


    if (!isNew) {
      this.document.$clinical_cases.push(new ClinicalCase().deserialize({ isNew: true }))
      this.selectedCase = this.document.$clinical_cases[this.document.$clinical_cases.length - 1]
    } else {
      this.openSnackBar("Error: New case is already opened", "OK");
      // this.selectedCase = isNew;
    }
  }

  showTarget(preview: boolean = false) {
    this.dataShareService.changeAuxText(this.selectedCase.$newCaseVersion.$clinical_case);
    if (preview) {
      this.dataShareService.previewTarget(true);
    }
  }

  onSubmit() {
    const style = ["error-snack-bar"]
    var text = (this.selectedCase.$newCaseVersion.$clinical_case).trim();
    this.selectedCase.$isNew = null;

    // Finding if the matching text exist in any other version
    var found = this.findEqualVersion(text);
    if (!found) {
      var now = Date.now();

      var jsonToSubmit = {
        _id: this.selectedCase.$_id,
        yes_no: this.selectedCase.$newCaseVersion.$yes_no,
        clinical_case: text,
        time: now,
        source_id: this.document.$_id,
        user_id: null
      }

      this.apiService.addClinicalCase(jsonToSubmit, this.docType).subscribe(result => {
        this.selectedCase.$_id = result.$_id
        this.selectedCase.$case_id = result.$case_id
        this.selectedCase.$versions = result.$versions;
        this.selectedCaseVersion = this.selectedCase.$versions[this.selectedCase.$versions.length - 1]
        this.openSnackBar("Added successfully", "OK");
      });
    } else {
      this.selectedCaseVersion = found;
      this.openSnackBar("Error: Already exist.", "OK", style);
    }
  }

  nextCase() {


  }

  previousCase() {


  }

  onPaste() {
    try {
      navigator.clipboard.readText().then(
        clipText => this.onChangeText(clipText)
      );
    } catch{
      console.log("Not supported with the browser");
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
