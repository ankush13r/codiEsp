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
  radioSelected: string = null;
  selected_case: any;
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
      console.log("debug: type");
      console.log(result);
      console.log("end->type");
    });
  }


  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      this.document = result;
      if (this.document && this.document.clinical_cases.length > 0) {
        this.selected_case = this.document.clinical_cases[this.document.clinical_cases.length - 1];
        this.selected_version = this.selected_case.versions[this.selected_case.versions.length - 1];
      }
      console.log("debug: clinical-case Document");
      console.log(result);
      console.log("end-> clinical-case Document");
    });
  }


  onCaseChange(value) {
    this.selected_version = this.selected_case.versions[this.selected_case.versions.length - 1]
  }

  onVersionChange(event) {
    console.log(this.selected_case);

    if (event.value) {
      this.selected_case.clinical_case = event.value["clinical_case"]
    } else {
      this.selected_case.clinical_case = this.selected_case["tmpText"];
    }
  }

  existVersion(event) {
    this.document.clinical_case = event.trim();
    this.selected_case.clinical_case = event;
    this.selected_case["tmpText"] = event.value;
    if (this.selected_case.versions) {
      this.selected_version = this.selected_case.versions.find((v) => v['clinical_case'] == event);
    }
  }

  newCase() {
    this.apiService.createNewCase(this.document._id).subscribe(result => {  
      this.document.clinical_cases.push(result)
    })

  }
  submitData() {
    ` TODO -> add time and meta_data into the sending object`
    this.document.clinical_case = this.document.clinical_case.trim()
    const style = ["error-snack-bar"]

    if (!this.selected_version) {
      var now = Date.now();
      this.document.time = now;
      this.document["yes_no"] = this.radioSelected;
      this.apiService.addClinicalCase(this.document, this.selected_type).subscribe(result => {
        this.document.id = result.id;
        this.document.versions = result.versions;
        this.openSnackBar("Added successfuly", "OK");
        this.selected_version = this.document.versions[this.document.versions.length - 1]
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
