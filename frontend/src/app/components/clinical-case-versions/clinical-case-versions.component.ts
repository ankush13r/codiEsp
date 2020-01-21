import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { Pipe, PipeTransform } from '@angular/core';

import { DataShareService } from '../../services/data-share.service';
import { FileObj } from 'src/app/interfaces/file-obj';



@Component({
  selector: 'app-clinical-case-versions',
  templateUrl: './clinical-case-versions.component.html',
  styleUrls: ['./clinical-case-versions.component.css']
})

export class ClinicalCaseVersionsComponent implements OnInit {
  title = "All versions"
  document: FileObj;
  safeUrl :SafeResourceUrl;
  textToShow: String;
  contentType: String;
  index : number;

  constTypeLink: String = "link"
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

        if (this.document.old_versions) {
          this.document.old_versions.sort((a, b) => a["time"] - b["time"])
        }
      }
    });
  }

  showLink() {
    this.index = null;
    this.contentType = this.constTypeLink;
    this.safeUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.document.link.toString());

  }

  showText(index) {
    if (index < this.document.old_versions.length) {
      this.index = index;
      this.contentType= this.constTypeText;
      this.textToShow = this.document.old_versions[index]["clinical_case"]
    } 
  }
}
