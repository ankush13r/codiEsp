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
  title = "Source"
  document: Document;
  safeUrl :SafeResourceUrl;
  textToShow: String;
  contentType: String;
  index : number;
  selected_case:any;
  selected_version:any;


  LINK: String = "link"
  TEXT: String = "text"
  
  constructor(private dataShareService: DataShareService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.observeDocument();
  }

  observeDocument() {
    this.dataShareService.observeDocument().subscribe(result => {
      if (result && this.document !== result ) {
        this.document = result;      
        this.showLink()
        if (this.document["clinical_cases"] && this.document["clinical_cases"].length > 0) {  
          console.log("version sorting");
                 
          this.document.versions.sort((a, b) => a["time"] - b["time"])
        }
      }
      console.log("debug: clinical-case-version Document");
      console.log(result);
      console.log("end-> clinical-case-version Document");
    });
  }


onCaseChange(value) {
    this.selected_version = this.selected_case.versions[this.selected_case.versions.length - 1]
    if(this.selected_version){
      this.contentType= this.TEXT;
      this.textToShow = this.selected_version["clinical_case"]   
    }
}

onVersionChange(event) {
  
  if (event.value) {
    this.contentType= this.TEXT;
    this.textToShow = event.value["clinical_case"]   
  } 
}
  showLink() {
    console.log(this.document);
    
    this.index = null;
    this.contentType = this.LINK;
    this.safeUrl= this.sanitizer.bypassSecurityTrustResourceUrl(this.document.link.toString());
  }

  showText(index) {
    if (index < this.document.versions.length) {
      this.index = index;
      this.contentType= this.TEXT;
      this.textToShow = this.document.versions[index]["clinical_case"]
    } 
  }
}
