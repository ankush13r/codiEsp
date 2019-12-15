import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { DataControllerService } from '../data-controller.service';
import { SourceDataService } from '../source-data.service';


@Component({
  selector: 'app-source-data',
  templateUrl: './source-data.component.html',
  styleUrls: ['./source-data.component.css']
})
export class TextBoxOrigComponent implements OnInit {
  title = "Origen";
  file: string = null;
  sourceData: Object = {};
  errorMessage:any;

  constructor(
    private dataControllerService: DataControllerService,
    private sourceDataService: SourceDataService) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    this.dataControllerService.getSelectedFile().subscribe(result => {     
       if (this.file !== result) {
        this.file = result
        this.getData();
              
      }
    });
  }

  getData() {
    this.sourceData = this.sourceDataService.getDataByFile(this.file);    
  }
}

