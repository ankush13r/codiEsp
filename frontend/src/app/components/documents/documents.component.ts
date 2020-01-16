import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from "../../services/api.service"
import { FilesObj } from 'src/app/interfaces/files-obj';
import { FileObj } from 'src/app/interfaces/file-obj';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  title = "Documents";
  selectedDoc: FileObj;
  data: FilesObj = null;

  paginationEvent: PageEvent;

  data_type: string = null;
  @Output() typeChanged = new EventEmitter()

  constructor(private apiService: ApiService, private dataShareService: DataShareService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getPathParams();
    this.getSelectedDoc();
  }

  getPathParams() {
    this.route.paramMap.subscribe(param => {
      this.data_type = param.get("type");
      this.getDocuments();
    });
  }
  ngOnChanges(changes: SimpleChange) {
    var currentValue = JSON.stringify(changes["data_type"].currentValue);
    var previousValue = JSON.stringify(changes["data_type"].previousValue);

    if (currentValue !== previousValue && currentValue != null) {
      this.getDocuments();
    }

  }

  getPaginationEvent(event) {
    this.paginationEvent = event

    if (this.paginationEvent && this.data_type) {
      this.getDocuments();
    }

  }

  getDocuments() {

    if (this.paginationEvent) {
      let index = (this.paginationEvent["pageIndex"]).toString();
      let pageSize = (this.paginationEvent["pageSize"]).toString();

      this.apiService.getDocuments(this.data_type, index, pageSize).subscribe(result => {
        this.data = result
      });

    } else {
      this.apiService.getDocuments(this.data_type).subscribe(result => {
        this.data = result
      });

    }
  }

  selectDoc(document) {
    var index = this.data.documents.indexOf(document)
    this.dataShareService.setSelectedFile(this.data.documents[index])
  }

  getSelectedDoc() {
    this.dataShareService.getSelectedFile().subscribe(result => {
      this.selectedDoc = result
    });
  }

  onTypeChange(type) {
    this.typeChanged.emit(type);
  }


}

