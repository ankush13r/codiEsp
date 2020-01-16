import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';

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
  docIndex: number;

  paginationEvent: PageEvent;

  data_type: string = null;
  @Output() typeChanged = new EventEmitter()

  constructor(private apiService: ApiService, private dataShareService: DataShareService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.getPathParams();
    this.getSelectedDoc();

  }

  getPathParams() {
    this.route.root.children.map(param =>
      param.paramMap.subscribe(param => {
        var index = param.get("index");
        var type = param.get("type");
        if (index) {
          this.docIndex = parseInt(index) - 1;
        }
        if (type) {
          this.data_type = type;
          this.getDocuments();
        }

      }))

    // this.route.paramMap.subscribe(param => {
    //   this.data_type = param.get("type");

    //   this.getDocuments();
    // });
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

      if (this.docIndex >= 0) {
        this.navigateClinicalCase(0)
      }
      this.getDocuments();
    }

  }

  navigateClinicalCase(index) {
    this.router.navigate(['', { outlets: { clinical_case: [index + 1] } }]).then(()=>{
      this.getPathParams();
      this.selectDoc(this.data.documents[index]);
    });

  }

  selectDoc(document) {
    this.dataShareService.setSelectedFile(document)
  }

  getDocuments() {

    if (this.paginationEvent) {
      let index = (this.paginationEvent["pageIndex"]).toString();
      let pageSize = (this.paginationEvent["pageSize"]).toString();

      this.apiService.getDocuments(this.data_type, index, pageSize).subscribe(result => {
        this.data = result;
        this.selectDoc(null)
        if ((this.docIndex && this.data.documents.length > this.docIndex) || this.docIndex == 0)
          this.selectDoc(this.data.documents[this.docIndex])
      });

    } else {
      this.apiService.getDocuments(this.data_type).subscribe(result => {
        this.data = result;
        this.selectDoc(null)
        if ((this.docIndex && this.data.documents.length > this.docIndex) || this.docIndex == 0)
          this.selectDoc(this.data.documents[this.docIndex])
      });
    }

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

