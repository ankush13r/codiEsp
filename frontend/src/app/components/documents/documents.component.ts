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
  pageIndex: number = null;
  pageLength: number = null;
  paginationEvent: PageEvent;

  selected_type: String = null;

  constructor(private apiService: ApiService, private dataShareService: DataShareService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getDocsType();
    this.getPathParams();
    this.getSelectedDoc();
  }

  getPathParams() {
    this.route.paramMap.subscribe(param => {
      if (param.get("type") && param.get("type") != this.selected_type) {
        this.dataShareService.setDocType(param.get("type"));
      }
    });
  }

  getDocsType() {
    this.dataShareService.getDocType().subscribe(type => {
      this.selected_type = type
      this.getDocuments()      
    }
    )
  }

  getPaginationEvent(event) {
    this.paginationEvent = event
    if (this.paginationEvent && this.selected_type) {
      this.pageIndex = this.paginationEvent["pageIndex"];
      this.pageLength = this.paginationEvent["pageSize"];
      this.getDocuments();
    }
  }

  getDocuments() {
    if (this.selected_type) {
      this.apiService.getDocuments(this.selected_type, this.pageIndex, this.pageLength).subscribe(result => {
        this.data = result
        this.selectDoc(this.data.documents[0])
      });

    }
  }

  selectDoc(document) {
    this.dataShareService.setSelectedFile(document)
  }

  getSelectedDoc() {
    this.dataShareService.getSelectedFile().subscribe(result => {     
      this.selectedDoc = result
    });
  }




}

