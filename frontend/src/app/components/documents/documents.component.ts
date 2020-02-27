import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { trigger, state, style, animate, transition, query, stagger } from '@angular/animations';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from "../../services/api-docs.service"
import { ApiResponse } from '../../models/apiResponse';
import { Document } from '../../models/document'
import { toolTips } from '../../../environments/environment';

export interface Pagination {
  [key: string]: {
    pageIndex: number;
    pageLength: number;
  }
}



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
  pagination: Pagination = {}

  paginationEvent: PageEvent;
  index: number = 0;

  doc_type: string = null;
  baseUrl = 'http://127.0.0.1:5000/docs/';

  //Get tool tips from constants.
  toolTips = toolTips;

  constructor(private apiService: ApiService, private dataShareService: DataShareService,
    private route: ActivatedRoute, private cookies: CookieService
  ) { }

  ngOnInit() {
    this.getCookies();
    this.getPathParams();
  }
  getCookies() {
    if (this.cookies.check("pagination"))
      this.pagination = JSON.parse(this.cookies.get("pagination"))
  }

  getPathParams() {
    this.route.paramMap.subscribe(param => {
      const type = param.get("type")
      if (type && type != this.doc_type) {
        this.doc_type = type;
        this.getDocuments(0);
      }
    });
  }



  onRightClick() {
    console.log("ssss");

  }

  setPageEvent(event) {
    this.pagination[this.doc_type] = {
      pageIndex: event.pageIndex,
      pageLength: event.pageSize
    }

    this.getDocuments(0);
  }

  onChangeIndex(event) {
    var value = event.target.value.trim();
    if (value && !isNaN(value) && parseInt(value) > 0) {
      this.pagination[this.doc_type].pageIndex = parseInt(value) - 1;
      this.getDocuments(0);
    }

  }

  getDocuments(index = null) {
    this.cookies.set("pagination", JSON.stringify(this.pagination));
    this.cookies.set("docType", this.doc_type);
    let pageIndex = null;
    let pageLength = null;
    if (this.pagination[this.doc_type]) {
      pageIndex = this.pagination[this.doc_type].pageIndex;
      pageLength = this.pagination[this.doc_type].pageLength;
    }

    if (this.doc_type) {
      this.apiService.getDocuments(
        this.doc_type,
        pageIndex,
        pageLength

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

  }



  onNextPrevious(value: number) {
    var tmpDocIndex = this.index + value;


    // If TmpDocIndex is greater than 0 and less than total length, it means TmpDocIndex is in range of documents list. 
    if (0 <= tmpDocIndex && tmpDocIndex < this.api_response.$documents.length) {
      this.selectDocument(tmpDocIndex)

      //Otherwise first get new documents and after select.
    } else {

      // tmpDocIndex is less than 0 and page index greater than 0, it means there documents those we can ask for from backend.
      if (this.pagination[this.doc_type].pageIndex && this.pagination[this.doc_type].pageIndex > 0) {
        this.pagination[this.doc_type].pageIndex = this.pagination[this.doc_type].pageIndex;
        this.getDocuments();

        //If tmpDocIndex is greater than api response's perPage value and pageIndex is no last page value. 
        // (this.pageIndex[this.doc_type] + 1 || 0)  If pagIndex[this.doc_type] is null of undefined than it wil choose 1
      } else if (tmpDocIndex >= this.api_response.$perPage && (this.pagination[this.doc_type].pageIndex + 1 || 1) < (this.api_response.$totalRecords / this.api_response.$perPage)) {
        this.pagination[this.doc_type].pageIndex = this.pagination[this.doc_type].pageIndex + 1 || 1;
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
    window.open((url).toString(), "_blank");
  }

}

