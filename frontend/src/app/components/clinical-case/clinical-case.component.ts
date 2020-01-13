import { Component, OnInit } from '@angular/core';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from 'src/app/services/api.service';
import { FileObj } from 'src/app/interfaces/file-obj';

@Component({
  selector: 'app-clinical-case',
  templateUrl: './clinical-case.component.html',
  styleUrls: ['./clinical-case.component.css']
})
export class clinicalCase implements OnInit {
  title = "Clinical case"
  document: FileObj = null;

  constructor(
    private dataControllerService: DataControllerService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    
    this.dataControllerService.getSelectedFile().subscribe(result => {
      if (this.document !== result) {
        this.document = result,
        console.log(result);

      }
    });
  }


  submitData() {
    ` must add time and meta_data into the sending object`

    this.document.time = "times"
    this.document.meta_data = {
      location: "location",
      conationTime: 12345
    };

    this.apiService.addClinicalCase(this.document).subscribe(result =>
      this.document.doc_id = result.doc_id      
    );
  }
  removeData() {
    this.apiService.removeClinicalCase(this.document);
  }
  modifyData() {
    this.apiService.modifyClinicalCase(this.document);
  }


}
