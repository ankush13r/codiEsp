import { Component, OnInit, Inject } from '@angular/core';
import { ClinicalDataService } from '../../../app/services/clinical-data.service';
import { ClinicalCase } from 'src/app/models/docs/clinicalCase';
import { ApiResponseDocs } from 'src/app/models/docs/api-response-docs';
import { Version } from '../../models/docs/version'
import { Document } from '../../models/docs/document'
import {MatDialogRef,MAT_DIALOG_DATA,MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { User } from 'src/app/models/user/user';
import { Role } from 'src/app/models/user/role';
import { isUndefined, isNullOrUndefined } from 'util';


const errorStyle = ["error-snack-bar"]


@Component({
  selector: 'app-clinical-data',
  templateUrl: './clinical-data.component.html',
  styleUrls: ['./clinical-data.component.css']
})
export class ClinicalDataComponent implements OnInit {
  isLodging: boolean = true;

  totalRecords: number;
  pageLength: number = 10;
  pageIndex: number = 0;
  showMoreCaseId: string = null;
  apiResponseDocs: ApiResponseDocs = null;

  showDocs: string[] = [];

  currentUser: User;

  constructor(private auth: AuthenticationService, private _snackBar: MatSnackBar, private _matDialog: MatDialog, private service: ClinicalDataService) {

  }

  ngOnInit(): void {
    this.auth.currentUser.subscribe(user => {
      this.currentUser = Object.assign(new User(), user)
    });
    this.getData();
  }

  get isAdmin(): boolean {

    return this.currentUser && this.currentUser.$role === Role.Admin;
  }

  getData() {
    this.isLodging = true;
    this.service.getClinicalCases(this.pageIndex, this.pageLength).subscribe(result => {
      this.apiResponseDocs = result;
      this.isLodging = false;

    });
  }
  onShowMore(id: string) {
    this.showMoreCaseId = this.showMoreCaseId == id ? null : id;
  }

  getSelectedVersion(clinicalCase: ClinicalCase): Version {
    let selectedVersionId = clinicalCase.$selectedVersionId;

    if (!isNullOrUndefined(selectedVersionId)) {
      return clinicalCase.$versions.find((version: Version) => version.$id == selectedVersionId)
    } else {
      return clinicalCase.$versions[clinicalCase.$versions.length - 1]
    }
  }

  onShowDoc(id: string) {
    let index = this.showDocs.findIndex(docId => docId == id);

    if (index === -1) {
      this.showDocs.push(id)
    } else {
      this.showDocs.splice(index, 1)
    }
  }


  onShowAllDocs(docs: Document[]) {
    this.showDocs = docs.map((doc: Document) => doc.$_id);
  }


  onHideAllDocs() {
    this.showDocs = []
  }

  setPageEvent(event) {
    this.pageIndex = event.pageIndex
    this.pageLength = event.pageSize

    this.getData();
  }

  onChangeSelectedVersionId(event, clinicalCase: ClinicalCase, versionId: number) {
    let selectedVersionId = null;

    if (event.checked) {
      selectedVersionId = versionId;
    }
    this.isLodging = true;

    this.service.modifySelectedVersionId(clinicalCase.$_id, selectedVersionId).subscribe(result => {
      if (result[0]) {
        clinicalCase.$selectedVersionId = selectedVersionId;

        let version = this.getSelectedVersion(clinicalCase);

        clinicalCase.$clinicalCase = version.$clinicalCase;
        clinicalCase.$hpoCodes = version.$hpoCodes;

        this.openSnackBar("Modified the version.", "OK")
      } else {
        this.openSnackBar(`Error:${result[1]}`, "OK", errorStyle)
      }
      this.isLodging = false;
    })




    // } else {

    //   clinicalCase.$selectedVersionId = null

    //   let version = clinicalCase.$versions[clinicalCase.$versions.length - 1]
    //   clinicalCase.$clinicalCase = version.$clinicalCase;
    //   clinicalCase.$hpoCodes = version.$hpoCodes;
    // }

  }

  onDeleteCase(doc: Document, case_id: string) {
    this.isLodging = true;

    this.service.deleteCase(case_id).subscribe(result => {
      if (result[0]) {
        this.getData();

        this.openSnackBar("Successfully delete the clinical case.", "OK")
      } else {
        this.openSnackBar(`Error:${result[1]}`, "OK", errorStyle)
      }
    })
  }

  onDeleteVersion(doc: Document, case_id: string, version_id: number) {
    this.isLodging = true;

    this.service.deleteVersion(case_id, version_id).subscribe(result => {

      if (result[0]) {
        this.deleteLocalVersion(doc, case_id, version_id)

        this.openSnackBar("Successfully delete the clinical case version.", "OK")
      } else {
        this.openSnackBar(`Error:${result[1]}`, "OK", errorStyle)
      }
      this.isLodging = false;

    })
  }


  onModify(case_id: string, obj: Version) {
    event.stopPropagation();
    const dialogRef = this.openDialog(obj)

    //When user close the dialog comes here.
    dialogRef.afterClosed().subscribe((result: Version) => {
      if (result && (JSON.stringify(obj) != JSON.stringify(result))) {
        this.isLodging = true;

        this.service.modifyCaseVersion(case_id, result).subscribe(apiResult => {
          if (apiResult[0]) {
            obj.$hpoCodes = result.$hpoCodes;
            obj.$clinicalCase = result.$clinicalCase;

            this.openSnackBar("Modified the clinical case version.", "OK")
          } else {
            this.openSnackBar(`Error:${result[1]}`, "OK", errorStyle)
          }
          this.isLodging = false;

        })
      }
    });
  }


  openDialog(obj: Version) {
    //Open dialog box of DialogAddTool.html
    return this._matDialog.open(ModifyCaseVersionDialog, {
      width: '800px',
      height: '700px',
      data: obj
    });
  }

  private deleteLocalVersion(doc: Document, case_id: string, version_id: number) {

    let clinicalCase = doc.$clinicalCases.find(clinicalCase => clinicalCase.$_id === case_id)

    if (clinicalCase.$versions.length > 1) {
      const versionIndex = clinicalCase.$versions.findIndex(version => version.$id === version_id)
      clinicalCase.$versions.splice(versionIndex, 1);
    } else {
      this.getData();
    }
  }


  openSnackBar(message: string, action: string = null, style = null) {
    this._snackBar.open(message, action, {
      duration: 2000,
      panelClass: style
    });
  }

}


//Form class
@Component({
  selector: 'modify-case-version',
  templateUrl: 'modify-case-version-form.html',
})

export class ModifyCaseVersionDialog implements OnInit {
  caseVersion: Version;

  constructor(public dialogRef: MatDialogRef<ClinicalCase>,
    @Inject(MAT_DIALOG_DATA) private data: Version) { }

  ngOnInit(): void {


    if (this.data) {

      this.caseVersion = Object.assign(new Version(), this.data);
      this.caseVersion.$hpoCodes = Object.assign([], this.data.$hpoCodes);
    } else {
      this.caseVersion = new Version();
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.caseVersion);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

}