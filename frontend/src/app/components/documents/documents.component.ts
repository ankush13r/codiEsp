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

  document: Document;
  api_response: ApiResponse = null;
  pageIndex: object = {};
  pageLength: object = {};
  paginationEvent: PageEvent;
  index: number = 0;

  doc_type: string = null;
  baseUrl = 'http://127.0.0.1:5000/documents/';

  constructor(private apiService: ApiService, private dataShareService: DataShareService,
    private route: ActivatedRoute, private cookies: CookieService
  ) {

  }

  ngOnInit() {
    this.getCookies();
    this.getDocsType();
    this.getPathParams();
  }
  getCookies() {
    if (this.cookies.check("pageIndex"))
      this.pageIndex = JSON.parse(this.cookies.get("pageIndex"))

    if (this.cookies.check("pageLength"))
      this.pageIndex = JSON.parse(this.cookies.get("pageLength"))
  }

  getPathParams() {
    this.route.paramMap.subscribe(param => {
      if (param.get("type") && param.get("type") != this.doc_type) {
        this.dataShareService.selectDocumentType(param.get("type"));
      }
    });
  }

  getDocsType() {
    this.dataShareService.observeDocumentType().subscribe(type => {
      this.doc_type = type;

      this.getDocuments(0);
    });
  }


  setPageEvent(event) {
    this.pageIndex[this.doc_type] = event.pageIndex;
    this.pageLength[this.doc_type] = event.pageSize;
    this.getDocuments(0);
  }

  onChangeIndex(event) {
    var value = event.target.value.trim();
    if (value && !isNaN(value) && parseInt(value) > 0) {
      this.pageIndex[this.doc_type] = parseInt(value) - 1;
      this.getDocuments(0);
    }

  }

  getDocuments(index = null) {

    this.cookies.set("pageIndex", JSON.stringify(this.pageIndex))
    if (this.doc_type) {
      this.apiService.getDocuments(
        this.doc_type,
        this.pageIndex[this.doc_type],
        this.pageLength[this.doc_type]

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
    this.document = this.api_response.$documents[index]
    this.dataShareService.selectDocument(this.api_response.$documents[index])

  }



  onNextPrevious(value: number) {
    var tmpDocIndex = this.index + value;
    
    
    // If TmpDocIndex is greater than 0 and less than total length, it means TmpDocIndex is in range of documents list. 
    if (0 <= tmpDocIndex && tmpDocIndex < this.api_response.$documents.length) {
      this.selectDocument(tmpDocIndex)

    //Otherwise first get new documents and after select.
    } else {

      // tmpDocIndex is less than 0 and page index greater than 0, it means there documents those we can ask for from backend.
      if (tmpDocIndex < 0 && this.pageIndex && this.pageIndex[this.doc_type] > 0) {
        this.pageIndex[this.doc_type] = this.pageIndex[this.doc_type] - 1;
        this.getDocuments();

      //If tmpDocIndex is greater than api response's perPage value and pageIndex is no last page value. 
      // (this.pageIndex[this.doc_type] + 1 || 0)  If pagIndex[this.doc_type] is null of undefined than it wil choose 1
      } else if (tmpDocIndex >= this.api_response.$perPage  && (this.pageIndex[this.doc_type] + 1 || 1) < (this.api_response.$totalRecords / this.api_response.$perPage)) {
        this.pageIndex[this.doc_type] = this.pageIndex[this.doc_type] + 1 || 1;
        this.getDocuments(0);

      }
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

