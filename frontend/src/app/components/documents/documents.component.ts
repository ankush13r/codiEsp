import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from "../../services/api.service"
import { FilesObj } from 'src/app/interfaces/files-obj';
import { FileObj } from 'src/app/interfaces/file-obj';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  title = "Documents";
  selectedDoc: FileObj;
  data: FilesObj = null;

  constructor(private apiService: ApiService, private dataControllerService: DataControllerService) {

  }

  ngOnInit() {
    this.getFiles();
    this.getSelectedDoc();
  }

  getFiles() {
    this.apiService.getFiles().subscribe(result => {
      this.data = result
    });
  }

  selectDoc(file) {
    this.dataControllerService.setSelectedFile(file)
  }
  getSelectedDoc() {
    this.dataControllerService.getSelectedFile().subscribe(result => {
      this.selectedDoc = result
    });
  }

}
