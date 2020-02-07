import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from "../../services/api.service"
import { ApiResponse } from '../../modules/apiResponse';
import { Document } from '../../modules/document'

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit {
  title = "Documents";
  showFiller = false;

  selected_document: Document;
  api_response: ApiResponse = null;
  pageIndex: object = {};
  pageLength: object = {};
  paginationEvent: PageEvent;
  index: number = 0;

  selected_type: string = null;
  baseUrl = 'http://127.0.0.1:5000/documents/';

  constructor(private apiService: ApiService, private dataShareService: DataShareService,
    private route: ActivatedRoute, private cookies: CookieService
  ) {

  }

  ngOnInit() {
    this.getCookies();
    this.getDocsType();
    this.getPathParams();
    this.observeDocument();
  }
  getCookies() {
    if (this.cookies.check("pageIndex"))
      this.pageIndex = JSON.parse(this.cookies.get("pageIndex"))

    if (this.cookies.check("pageLength"))
      this.pageIndex = JSON.parse(this.cookies.get("pageLength"))
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

      this.getDocuments(0);
    });
  }


  setPageEvent(event) {
    this.pageIndex[this.selected_type] = event.pageIndex;
    this.pageLength[this.selected_type] = event.pageSize;
    this.getDocuments(0);
  }

  onChangeIndex(event) {
    var value = event.target.value.trim();
    if (value && !isNaN(value) && parseInt(value) > 0) {
      this.pageIndex[this.selected_type] = parseInt(value) - 1;
      this.getDocuments(0);
    }

  }

  getDocuments(index = null) {
    
    this.cookies.set("pageIndex", JSON.stringify(this.pageIndex))
    if (this.selected_type) {
      this.apiService.getDocuments(
        this.selected_type,
        this.pageIndex[this.selected_type],
        this.pageLength[this.selected_type]

      ).subscribe(result => {
      this.api_response = result
        if (index || index == 0) {
          this.selectDocument(index);
        } else {
          this.selectDocument(this.api_response.$documents.length - 1);
        }

      });
    }
  }

  selectDocument(index: number) {
    this.index = index;
    this.dataShareService.selectDocument(this.api_response.$documents[index])

  }

  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      this.selected_document = result
    });
  }

  onNextPrevious(value: number) {
    var tmpIndex = this.index + value;
    
    if (this.api_response.$perPage <= tmpIndex || tmpIndex < 0) {
      
      if (tmpIndex < 0 && this.pageIndex && this.pageIndex[this.selected_type] > 0) {
        this.pageIndex[this.selected_type] = this.pageIndex[this.selected_type] - 1;
        this.getDocuments();
        
      } else if (this.api_response.$perPage <= tmpIndex && this.pageIndex[this.selected_type] +1 < (this.api_response.$totalRecords/this.api_response.$perPage)) {        
        this.pageIndex[this.selected_type] = this.pageIndex[this.selected_type] + 1;
        this.getDocuments(0);        
      }         
    } else {
      
      this.selectDocument(tmpIndex)
    }

  }


  newWindow(document) {
    var url;
    if (document.$format == "link")
      url = document.$link
    else
      url = this.baseUrl + document.$format + "/" + document.$_id;

    window.open((url).toString(), "_blank")

  }

}

