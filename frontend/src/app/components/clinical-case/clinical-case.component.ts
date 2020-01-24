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
  document: Document = null;
  selected_type: string = null;
  error: boolean = false;
  radioBoxValues = ["si", "no"];
  radioSelected: string = null;
  selected_version;

  constructor(
    private _snackBar: MatSnackBar,
    private dataShareService: DataShareService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.getPathParams();
    this.getSelectedType();
    this.getSelectedFile();
  }


  getPathParams() {
    this.route.root.children.map(param =>
      param.paramMap.subscribe(param => {
        var link = param.get("type");
        var type = param.get("link");
      }))
  }

  getSelectedType() {
    this.dataShareService.getDocType().subscribe(result => {
      if (this.selected_type != result) {
        this.selected_type = result;
      }
    });
  }

  getSelectedFile() {
    this.dataShareService.getSelectedFile().subscribe(result => {
      if (this.document !== result) {
        this.document = result;
        if (this.document.versions) {
          this.existVersion(this.document.clinical_case)
        } else {
          this.selected_version = null;
        }
      }
    });
  }

  onSelectionChange(event){
    if(event.value){
      this.document.clinical_case = event.value["clinical_case"] 
    }else{
      this.document.clinical_case = this.document["temp_clinical_case"];  
    }    
    

  }

  existVersion(event) {
    this.document.clinical_case = event.trim();   
    this.document["temp_clinical_case"] = this.document.clinical_case;
    if (this.document.versions) {
      this.selected_version  = this.document.versions.find((v) => v['clinical_case'] === this.document.clinical_case);
    }
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

  removeData() {
    this.apiService.removeClinicalCase(this.document);
  }
  modifyData() {
    this.apiService.modifyClinicalCase(this.document);
  }


  openSnackBar(message: string, action: string = null, style = ['snackbar-style']) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: style
    });
  }

}
