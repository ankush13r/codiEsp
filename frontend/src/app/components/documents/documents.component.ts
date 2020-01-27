import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from "../../services/api.service"
import { ApiSchema } from 'src/app/interfaces/apiSchema';
import { Document } from 'src/app/interfaces/document';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  title = "Documents";
  selected_document: Document;
  data: ApiSchema = null;
  pageIndex: object = {};
  pageLength: object = {};
  paginationEvent: PageEvent;
  index = 0;
  size = 10;

  selected_type: string = null;

  constructor(private apiService: ApiService, private dataShareService: DataShareService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getDocsType();
    this.getPathParams();
    this.observeDocument();
  }

  getPathParams() {
    this.route.paramMap.subscribe(param => {
      if (param.get("type") && param.get("type") != this.selected_type) {
        this.dataShareService.selectDocumentType(param.get("type"));
      }
    });
  }

  getDocsType() {
    this.dataShareService.observeDocumentType().subscribe(type => {
      this.selected_type = type;
      this.getDocuments();
    });
  }

  getPaginationEvent(event) {
    this.paginationEvent = event
    if (this.paginationEvent && this.selected_type) {
      this.pageIndex[this.selected_type] = this.paginationEvent["pageIndex"];
      this.pageLength[this.selected_type] = this.paginationEvent["pageSize"];
      this.getDocuments();
    }
  }

  getDocuments() {
    if (this.selected_type) {
      this.apiService.getDocuments(
        this.selected_type,
        this.pageIndex[this.selected_type],
        this.pageLength[this.selected_type]
      ).subscribe(result => {
        this.data = result
        this.selectDocument(this.data.documents[0]);
      });
    }
  }

  selectDocument(selected_document) {
    this.dataShareService.selectDocument(selected_document)

  }

  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      this.selected_document = result
    });
  }



  newWindow() {
    window.open((this.selected_document.link).toString(), "_blank")
  }


}

