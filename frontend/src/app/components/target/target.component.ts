import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from '../../services/api-docs.service';
import { Document } from '../../models/docs/document';
import { ClinicalCase } from '../../models/docs/clinicalCase';
import { Version } from '../../models/docs/version';
import { toolTips } from '../../../environments/environment';


const errorStyle = ["error-snack-bar"]

@Component({
  selector: 'app-target',
  templateUrl: './target.component.html',
  styleUrls: ['./target.component.css'],
  encapsulation: ViewEncapsulation.None,
})



export class TargetComponent implements OnInit, OnChanges {
  title = "Clinical case"
  yesNoValues: string[] = ["yes", "no"]
  toolTips = toolTips;

  @Output() nextOrPrevious = new EventEmitter<number>();
  @ViewChild('backTextarea', null) backTextarea: ElementRef;
  @ViewChild('textarea', null) textarea: ElementRef;

  @Input() document: Document;

  hpoData: any = null;

  //Case selected by user.
  selectedCase: ClinicalCase = null;

  //case version selected by user.
  selectedCaseVersion: Version = null;

  // Temporal text of user input textarea.
  auxText: string = null;

  constructor(
    private _snackBar: MatSnackBar,
    private dataShareService: DataShareService,
    private apiService: ApiService,
  ) { }

  ngOnInit() { }


  ngOnChanges(changes: SimpleChanges) {

    for (const propName in changes) {

      if (changes.hasOwnProperty(propName)) {
        if (propName == 'document' && this.document) {
          this.selectLastCase();
        }

      }
    }
  }

  selectLastCase() {
    this.selectedCase = this.document.$clinical_cases[this.document.$clinical_cases.length - 1];
    this.selectNewVersion();
  }


  onVersionChange(event) {
    this.selectedCaseVersion = event.value;
    this.showTarget();
  }

  onChangeText(event) {
    this.showTarget();
  }

  onEdit(clear: boolean = false) {

    if (clear) {
      this.selectedCase.$newCaseVersion.$clinical_case = ""
      this.selectedCase.$newCaseVersion.$hpoCodes = [];
      this.auxText = ""
    } else {
      this.selectedCase.$newCaseVersion.$clinical_case = this.selectedCaseVersion.$clinical_case;
      this.selectedCase.$newCaseVersion.$hpoCodes = this.selectedCaseVersion.$hpoCodes;
    } this.selectNewVersion();
  }


  onNewCase() {
    var newCase = this.document.$clinical_cases.find((cases) => cases.$isNew == true);

    if (!newCase) {
      this.document.$clinical_cases.push(new ClinicalCase().deserialize({ isNew: true }))
      this.selectedCase = this.document.$clinical_cases[this.document.$clinical_cases.length - 1]
    } else {
      this.selectedCase = newCase;
      this.openSnackBar("Error: New case is already created", "OK", errorStyle);
    }
    this.selectNewVersion();
  }

  onFinish() {

    this.apiService.finishDocument(this.document.$_id).subscribe(result => {
      if (result.data == 1) {
        this.document.$state = "1";
      }

    })
  }
  nextDoc() {
    this.nextOrPrevious.emit(1);
  }

  previousDoc() {
    this.nextOrPrevious.emit(-1);
  }

  @HostListener("scroll", ['$event'])
  onScroll(event) {  
    let scrollOffset = event.srcElement.scrollTop;
    this.backTextarea.nativeElement.scrollTop = scrollOffset

  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {  
    let scrollOffset = this.textarea.nativeElement.scrollTop;
    this.backTextarea.nativeElement.scrollTop = scrollOffset

  }


  showTarget(preview: boolean = false) {    
    this.dataShareService.changeAuxText(this.selectedCaseVersion.$clinical_case);
    if (preview) {
      this.dataShareService.previewTarget(true);
    }
  }


  onPaste() {
    try {
      navigator.clipboard.readText().then(
        clipText => {
          this.selectedCase.$newCaseVersion.$clinical_case = clipText;
          this.selectNewVersion();
        }
      );
    } catch{
      console.info("Not supported with the browser");
    }
  }

  onSubmit() {

    var text = (this.selectedCase.$newCaseVersion.$clinical_case).trim();
    this.selectedCase.$isNew = null;

    // Finding if the matching text exist in any other version
    var found = this.findEqualVersion(text);
    if (!found) {
      var now = Date.now();

      var jsonToSubmit = {
        _id: this.selectedCase.$_id,
        yes_no: this.selectedCase.$newCaseVersion.$yes_no,
        clinical_case: text,
        time: now,
        source_id: this.document.$_id,
        user_id: null,
        hpoCodes: this.selectedCase.$newCaseVersion.$hpoCodes.map(code => {
          return { "id": code["id"], "name": code['name'] }
        })
      }
      console.log(jsonToSubmit);

      this.apiService.addClinicalCase(jsonToSubmit).subscribe(result => {
        this.selectedCase.$_id = result.$_id
        this.selectedCase.$case_id = result.$case_id
        this.selectedCase.$versions = result.$versions;
        this.document.$state = "0";
        this.selectedCaseVersion = this.selectedCase.$versions[this.selectedCase.$versions.length - 1]
        this.openSnackBar("Added successfully", "OK");
      });
    } else {
      this.selectedCaseVersion = found;
      this.openSnackBar("Error: Already exist.", "OK", errorStyle);
    }
  }


  //Functions as utils, those are called by other functions.
  //--------------------------------------------------------

  findEqualVersion = (text) => this.selectedCase.$versions.find((v) => v.$clinical_case.toLowerCase() == text.toLowerCase());


  selectNewVersion() {
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
  }




  openSnackBar(message: string, action: string = null, errorStyle = ['snackbar-errorStyle']) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: errorStyle
    });
  }
}