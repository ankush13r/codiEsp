import { Component, OnInit, Input, EventEmitter, Output, ViewEncapsulation, HostListener, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataShareService } from '../../services/data-share.service';
import { ApiService } from '../../services/api.service';
import { Document } from '../../modules/document';
import { ClinicalCase } from '../../modules/clinicalCase';
import { Version } from '../../modules/version';


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

  @Output() nextOrPrevious = new EventEmitter<number>();
  @ViewChild('backTextarea', null) backTextarea: ElementRef;
  @Input() document: Document;

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

  ngOnInit() {

  }


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
    this.selectNewVersion(true);
  }


  
  

  onVersionChange(event) {
    this.selectedCaseVersion = event.value;
    this.getAuxText(this.selectedCaseVersion.$clinical_case);
  }

  onChangeText(event) {
    this.getAuxText(event);
  }

  onEdit(clear: boolean=false) {

    if (clear)
      this.selectedCase.$newCaseVersion.$clinical_case = ""
    else
      this.selectedCase.$newCaseVersion.$clinical_case = this.selectedCaseVersion.$clinical_case;

    this.selectNewVersion();
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
    this.selectNewVersion(true);
  }

  onFinish() {

    this.apiService.finishDocument(this.document.$_id).subscribe(result => {
      if (result.data == 1) {
        this.document.$state = "1";
      }

    })
  }
  nextCase() {
    this.nextOrPrevious.emit(1);
  }

  previousCase() {
    this.nextOrPrevious.emit(-1);
  }

  @HostListener("scroll", ['$event'])
  onScroll(event) {

    let scrollOffset = event.srcElement.scrollTop;
    this.backTextarea.nativeElement.scrollTop = scrollOffset

  }


  showTarget(preview: boolean = false) {
    this.dataShareService.changeAuxText(this.selectedCase.$newCaseVersion.$clinical_case);
    if (preview) {
      this.dataShareService.previewTarget(true);
    }
  }


  onPaste() {
    try {
      navigator.clipboard.readText().then(
        clipText => {
          this.selectedCase.$newCaseVersion.$clinical_case = clipText;
          this.getAuxText(clipText)
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
        user_id: null
      }

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
 

  selectNewVersion(getAuxText = false) {
    this.selectedCaseVersion = this.selectedCase.$newCaseVersion;
    if (getAuxText) {
      this.getAuxText(this.selectedCaseVersion.$clinical_case);

    }

  }

  getAuxText(text: string) {
    if (!text) {
      this.auxText = null;
      return null;
    }

    var newText = ""
    for (let i = 0; i < text.length; i++) {

      if (text[i] == "\n")
        newText += "<mark>\n</mark>"
      else
        newText += text[i]
    }

    this.auxText = newText + "\n"
  }


  openSnackBar(message: string, action: string = null, errorStyle = ['snackbar-errorStyle']) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: errorStyle
    });
  }
}
//----------------------------

//     if (Array.isArray(this.document.clinical_cases)) {
//       console.log("ss");
//       var exist_new = (this.document.clinical_cases.filter((v) => v['new'])).find(bool => bool = true);
//       if (!exist_new) {
//         this.apiService.createNewCase(this.document._id).subscribe(result => {
//           this.document.clinical_cases.push(result)
//           this.clinical_case = this.document.clinical_cases[this.document.clinical_cases.length - 1];
//         });
//       }
//     } else {
//       this.apiService.createNewCase(this.document._id).subscribe(result => {
//         this.document.clinical_cases = [result]
//         this.clinical_case = this.document.clinical_cases[0]
//       });
//     }
//   }


//   submitData() {
//     ` TODO -> add time and meta_data into the sending object`

//     const errorStyle = ["error-snack-bar"]

//     if (!this.selected_version || this.selected_version == -1) {
//       console.log(this.clinical_case);

//       var now = Date.now();
//       this.clinical_case.time = now;
//       this.clinical_case["yes_no"] = this.radioSelected;
//       this.apiService.addClinicalCase(this.clinical_case, this.selected_type).subscribe(result => {
//         this.clinical_case.versions = result.versions;

//         console.log(result);

//         this.selected_version = this.clinical_case.versions[this.clinical_case.versions.length - 1]
//         this.openSnackBar("Added successfuly", "OK");
//       });
//     }
//   }


//   openSnackBar(message: string, action: string = null, errorStyle = ['snackbar-errorStyle']) {
//     this._snackBar.open(message, action, {
//       duration: 2000,
//       panelClass: errorStyle
//     });
//   }


//----------------------------

  // getPathParams() {
  //   this.route.root.children.map(param =>
  //     param.paramMap.subscribe(param => {
  //       var link = param.get("type");
  //       var type = param.get("link");
  //     }))
  // }
