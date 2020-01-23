import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

import { DataShareService } from '../../services/data-share.service';
import { Document } from 'src/app/interfaces/document';



@Component({
  selector: 'app-clinical-case-versions',
  templateUrl: './clinical-case-versions.component.html',
  styleUrls: ['./clinical-case-versions.component.css']
})

export class ClinicalCaseVersionsComponent implements OnInit {
  title = "All versions"
  document: Document;
  safeUrl :SafeResourceUrl;
  textToShow: String;
  contentType: String;
  index : number;

  LINK: String = "link"
  constTypeText: String = "text"

  constructor(private dataShareService: DataShareService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    this.dataShareService.getSelectedFile().subscribe(result => {

      if (this.document !== result && result) {
        this.document = result;
        this.showLink()

        if (this.document.versions) {
          this.document.versions.sort((a, b) => a["time"] - b["time"])
        }
      }
    });
  }

  showLink() {
    this.index = null;
    this.contentType = this.LINK;
    this.safeUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.document.link.toString());
  }

  showText(index) {
    if (index < this.document.versions.length) {
      this.index = index;
      this.contentType= this.constTypeText;
      this.textToShow = this.document.versions[index]["clinical_case"]
    } 
  }
}
