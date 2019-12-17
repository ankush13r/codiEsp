import { Component, OnInit, ViewChildren } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from '../../services/api.service';
import { FileObj } from 'src/app/interfaces/file-obj';


@Component({
  selector: 'app-source-data',
  templateUrl: './source-data.component.html',
  styleUrls: ['./source-data.component.css']
})
export class SourceDataComponent implements OnInit {

  title = "Source";
  file: FileObj = null;

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
      }
    });
  }



  moveSelectedData() {
    var selectedObj = document.getSelection();
    var startNode = selectedObj.anchorNode.parentElement;
    var endNode = selectedObj.focusNode.parentElement;
    if (endNode.getAttribute("id") === "sourceText" &&
      startNode.getAttribute("id") === "sourceText" && selectedObj.toString() != "") {
      if (
        this.file.target == ""
        || this.file.target == null
        || confirm("Do you really want to do it? It will erase old text.")
      ) {
        this.file.target = selectedObj.toString();

      } else if (selectedObj.toString() != "") {
        console.log("Error: The text must be from the origen box");

      } else {
        console.log("Error: Nothing selected");
      }
    }

  }
}

