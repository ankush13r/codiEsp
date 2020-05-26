import { Component, OnInit, SecurityContext, ViewEncapsulation, SimpleChanges, OnChanges, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

import { environment } from '../../../environments/environment'
import { DataShareService } from '../../services/data-share.service';
import { Document } from '../../models/docs/document';



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class PreviewComponent implements OnInit , OnChanges{

  title = "Preview"
  @Input() document: Document;
  safeUrl: SafeResourceUrl;
  auxText: string;
  contentType: String;
  apiBaseUrl = `${environment.apiUrl}/docs`;



  LINK: String = "link"
  TEXT: String = "text"

  constructor(private dataShareService: DataShareService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.observeDocument();
    this.observeAuxText();
    this.observePreviewTarget();    
  }


  observeDocument() {
    // this.dataShareService.observeDocument().subscribe(result => {
    //   if (result && this.document !== result) {
    //     this.document = result;
    //     this.showLink()
    //     if (this.document["clinicalCases"] && this.document["clinicalCases"].length > 0) {
    //       // this.document.versions.sort((a, b) => a["time"] - b["time"])
    //     }
    //   }

    // });
  }
  ngOnChanges(changes: SimpleChanges) {

    for (const propName in changes) {

      if (changes.hasOwnProperty(propName)) {
        if (propName == 'document' && this.document) {
          this.showLink()
          if (this.document["clinicalCases"] && this.document["clinicalCases"].length > 0) {
            // this.document.versions.sort((a, b) => a["time"] - b["time"])
          }
        }

      }
    }
  }

  observeAuxText() {
    this.dataShareService.observeAuxText().subscribe(result => {
        this.auxText = result;
    });
  }

  observePreviewTarget() {
    this.dataShareService.observePreviewTarget().subscribe(result => {
      if (result) {
        this.showText();
      }
    })
  }

  showLink() {
    
    this.contentType = this.LINK;
    if (this.document.$format == "link")
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.document.$link);
    else
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl( `${this.apiBaseUrl}/${this.document.$format}/${this.document.$_id}`);
      
  }

  showText() {
    this.contentType = this.TEXT;
  }

}
