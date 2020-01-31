import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

import { DataShareService } from '../../services/data-share.service';
import { Document } from '../../modules/document';



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})

export class ClinicalCaseVersionsComponent implements OnInit {
  title = "Source"
  document: Document;
  safeUrl: SafeResourceUrl;
  auxText: String;
  contentType: String;



  LINK: String = "link"
  TEXT: String = "text"

  constructor(private dataShareService: DataShareService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.observeDocument();
    this.observeAuxText();
    this.observePreviewTarget();
  }


  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      if (result && this.document !== result) {
        this.document = result;
        this.showLink()
        if (this.document["clinical_cases"] && this.document["clinical_cases"].length > 0) {
          // this.document.versions.sort((a, b) => a["time"] - b["time"])
        }
      }

    });
  }


  observeAuxText(){
    this.dataShareService.observeAuxText().subscribe(result => 
      this.auxText = result
    );
  }


  observePreviewTarget(){
    this.dataShareService.observePreviewTarget().subscribe(result=>{
      if(result){
        this.showText();
      }
    })
  }

  showLink() {
    this.contentType = this.LINK;
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.document.$link);
  }

  showText() {
    this.contentType = this.TEXT;
  }

}
