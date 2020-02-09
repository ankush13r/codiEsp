import { Component, OnInit, SecurityContext, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

import { DataShareService } from '../../services/data-share.service';
import { Document } from '../../modules/document';



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class PreviewComponent implements OnInit {

  title = "Preview"
  document: Document;
  safeUrl: SafeResourceUrl;
  auxText: String;
  contentType: String;
  baseUrl = 'http://127.0.0.1:5000/documents/';


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

  parse_text(text:string) {
    var textList = text.split("")

    var newText = ""
    let found = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] == "\n") {
        newText +=  "<mark>\n</mark>"
      }else{
        newText +=text[i]
      }
  
    }
    return newText
  }
  // if (text[i] == "\n") {
  //   if (found == false) {
  //     newText += "<mark>";
  //   }
  //   newText += text[i];
  //   found = true;
  // } else {
  //   if (found == true) {
  //     newText += "</mark>";
  //     found = false;
  //   }
  //   newText += text[i]

  // }
  observeAuxText() {
    this.dataShareService.observeAuxText().subscribe(result => {
      
      if (result) {
        this.auxText = this.parse_text(result);
      }

    }

    );
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
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.baseUrl + this.document.$format + "/" + this.document.$_id);
  }

  showText() {
    this.contentType = this.TEXT;
  }

}
