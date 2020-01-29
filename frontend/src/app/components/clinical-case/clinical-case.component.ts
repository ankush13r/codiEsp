import { Component, OnInit, Input, RootRenderer } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from 'src/app/services/api.service';
import { Document } from 'src/app/interfaces/document';


@Component({
  selector: 'app-clinical-case',
  templateUrl: './clinical-case.component.html',
  styleUrls: ['./clinical-case.component.css']
})



export class clinicalCase implements OnInit {
  title = "Clinical case"
  document: any = null;
  selected_type: string = null;
  error: boolean = false;
  radioBoxValues = ["si", "no"];
  selected_case: any;
  new_version: object = {}
  selected_version;
  tmpDoc: any;

  constructor(
    private _snackBar: MatSnackBar,
    private dataShareService: DataShareService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.getPathParams();
    this.observeDocumentType();
    this.observeDocument();
  }

  observeDocumentType() {
    this.dataShareService.observeDocumentType().subscribe(result => {
      this.selected_type = result;
    });
  }


  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      this.document = result;
      if (this.document) {
        if (this.document.clinical_cases.length == 0) {
          this.newCase();
        } else {
          this.selected_case = this.document.clinical_cases[this.document.clinical_cases.length - 1];
          this.selected_version = -1;
        }
        if (!this.selected_case.new_version) {
          this.selected_case.new_version = {}
        }
      }
    })
  }

  onCaseChange(value) {
    this.selected_version = -1;
    if (this.selected_case.new_version) {
      this.new_version = this.selected_case.new_version;
    } else {
      this.new_version = {};
    }
  }

  onVersionChange(event) {
    if (event.value && event.value != -1) {
      this.new_version.clinical_case = event.value["clinical_case"]
    } else {
      this.new_version = this.selected_case.new_version
    }
    console.log(this.new_version);

  }

  onChangeText(event) {
    this.new_version.clinical_case = event.trim();
    this.selected_case["tmpText"] = event.trim();
    if (this.selected_case.versions) {
      var found = this.selected_case.versions.find((v) => v['clinical_case'] == event.trim());
      this.selected_version = found ? found : -1;
    }
    console.log(this.selected_case.new_version);


  }

  newCase() {

    if (Array.isArray(this.document.clinical_cases)) {
      console.log("ss");
      var exist_new = (this.document.clinical_cases.filter((v) => v['new'])).find(bool => bool = true);
      if (!exist_new) {
        this.apiService.createNewCase(this.document._id).subscribe(result => {
          this.document.clinical_cases.push(result)
          this.selected_case = this.document.clinical_cases[this.document.clinical_cases.length - 1];
        });
      }
    } else {
      this.apiService.createNewCase(this.document._id).subscribe(result => {
        this.document.clinical_cases = [result]
        this.selected_case = this.document.clinical_cases[0]
      });
    }
  }


  submitData() {
    ` TODO -> add time and meta_data into the sending object`

    const style = ["error-snack-bar"]

    if (!this.selected_version || this.selected_version == -1) {
      console.log(this.selected_case);

      var now = Date.now();
      this.selected_case.time = now;
      this.selected_case["yes_no"] = this.radioSelected;
      this.apiService.addClinicalCase(this.selected_case, this.selected_type).subscribe(result => {
        this.selected_case.versions = result.versions;

        console.log(result);

        this.selected_version = this.selected_case.versions[this.selected_case.versions.length - 1]
        this.openSnackBar("Added successfuly", "OK");
      });
    }
  }


  openSnackBar(message: string, action: string = null, style = ['snackbar-style']) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: style
    });
  }

}



// removeData() {
  // this.apiService.removeClinicalCase(this.document);
// }
// modifyData() {
  // this.apiService.modifyClinicalCase(this.document);
// }

  // getPathParams() {
  //   this.route.root.children.map(param =>
  //     param.paramMap.subscribe(param => {
  //       var link = param.get("type");
  //       var type = param.get("link");
  //     }))
  // }
