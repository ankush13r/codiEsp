import { Component, OnInit, ViewChildren } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from '../../services/api.service';


@Component({
  selector: 'app-source-data',
  templateUrl: './source-data.component.html',
  styleUrls: ['./source-data.component.css']
})
export class SourceDataComponent implements OnInit {

  title = "Source";
  file: string = null;
  sourceData: Object = {};
  errorMessage: any;

  constructor(
    private dataControllerService: DataControllerService,
    private apiService: ApiService) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    this.dataControllerService.getSelectedFile().subscribe(result => {
      if (this.file !== result) {
        this.file = result
        this.getData();
        this.setExistData();
      }
    });
  }
  getData() {
    this.sourceData = this.apiService.getDataByFile(this.file);
  }

  setExistData() {
    var result = (this.sourceData["data"]) ? true : false;
    this.dataControllerService.setIsFoundData(result);
  }
  moveSelectedData() {
    var selectedObj = document.getSelection();
    var startNode = selectedObj.anchorNode.parentElement;
    var endNode = selectedObj.focusNode.parentElement;
    if (endNode.getAttribute("id") === "sourceText" &&
      startNode.getAttribute("id") === "sourceText") {
        this.dataControllerService.setTargetText(selectedObj.toString());
      }else{
        console.log("Error: The text must be from the origen box");
      }
  }
  
}

