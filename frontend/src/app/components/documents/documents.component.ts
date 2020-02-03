import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from "../../services/api.service"

import { ApiResponse } from '../../modules/apiResponse';
import {Document} from '../../modules/document'

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  title = "Documents";
  selectedDocument: Document;
  apiResponse: ApiResponse = null;
  pageIndex: object = {pdf:0,html:0,link:0};
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

 
  setPageEvent(event){
    this.pageIndex[this.selected_type] = event.pageIndex;
    this.pageLength[this.selected_type] = event.pageSize;
    this.getDocuments();
  }

  onChangeIndex(event){
    var value = event.target.value.trim();
    if(value && !isNaN(value) && parseInt(value) > 0){
      this.pageIndex[this.selected_type] = parseInt(value) -1 ;
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
        this.apiResponse = result
        this.selectDocument(this.apiResponse.$documents[0]);
      });
    }
  }

  selectDocument(document) {
    this.dataShareService.selectDocument(document)

  }

  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      this.selectedDocument = result
    });
  }



  newWindow() {
    window.open((this.selectedDocument.$link).toString(), "_blank")
  }


}

