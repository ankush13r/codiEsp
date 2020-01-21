import { Component, OnInit, Input, RootRenderer } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from 'src/app/services/api.service';
import { FileObj } from 'src/app/interfaces/file-obj';
import { Route } from '@angular/compiler/src/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-clinical-case',
  templateUrl: './clinical-case.component.html',
  styleUrls: ['./clinical-case.component.css']
})



export class clinicalCase implements OnInit {
  title = "Clinical case"
  document: FileObj = null;
  selected_type: String = null;
  error: boolean = false;
  radioBoxValues = ["si","no"];
  radioSelected:number;

  constructor(
    private dataShareService: DataShareService,
    private apiService: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // this.getPathParams();
    this.getSelectedType();
    this.getSelectedFile();
  }


  onSelectionChange(value) {    
    this.radioSelected = value;
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
        if(Object.keys(result).includes(this.radioBoxValues[0])){
          this.radioSelected = 0;
        }else if(Object.keys(result).includes(this.radioBoxValues[1])){
          this.radioSelected = 1;
        }
      }
    });
  }

  submitData() {
    ` must add time and meta_data into the sending object`

    var now = Date.now();
    this.document.time = now;
    if(this.radioSelected >= 0 && this.radioSelected < this.radioBoxValues.length){
      for(let item of this.radioBoxValues){
        delete this.document[item];
      }
      this.document[this.radioBoxValues[this.radioSelected]] = true;
    }
    this.apiService.addClinicalCase(this.document, this.selected_type).subscribe(result => {
      this.document.doc_id = result.doc_id;
      this.document.old_versions = result.old_versions;
    }
    );
  }
  removeData() {
    this.apiService.removeClinicalCase(this.document);
  }
  modifyData() {
    this.apiService.modifyClinicalCase(this.document);
  }


}
