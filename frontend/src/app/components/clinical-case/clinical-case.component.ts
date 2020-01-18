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

  getPathParams() {
    this.route.root.children.map(param =>
      param.paramMap.subscribe(param => {
        var link = param.get("type");
        var type = param.get("link");
        if (link) {
          console.log(link);
        }
        if (type) {
          console.log(type);
        }

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
      }
    });
  }

  submitData() {
    ` must add time and meta_data into the sending object`

    var now = Date.now();
    this.document.time = now;
    
    this.document.meta_data = {
      location: "location",
      conationTime: 12345
    };

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
