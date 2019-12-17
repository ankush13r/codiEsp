import { Component, OnInit } from '@angular/core';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from 'src/app/services/api.service';
import { FileObj } from 'src/app/interfaces/file-obj';

@Component({
  selector: 'app-target-data',
  templateUrl: './target-data.component.html',
  styleUrls: ['./target-data.component.css']
})
export class TargetDataComponent implements OnInit {
  title = "Target"
  file: FileObj = null;

  constructor(
    private dataControllerService: DataControllerService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    this.dataControllerService.getSelectedFile().subscribe(result => {
      if (this.file !== result) {
        this.file = result
      }
    });
  }


  submitData() {
    this.apiService.postData(this.file);
  }
  removeData() {
    this.apiService.removeData(this.file);
  }
  modifyData() {
    this.apiService.modifyData(this.file);
  }

  
}
