import { Component, OnInit, Input, Inject, ChangeDetectorRef } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { RegexObj } from '../../models/regex/regex-obj';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { RegexService } from '../../services/regex.service';
import { RegexType } from 'src/app/models/regex/regex-type';


@Component({
  selector: 'app-regex',
  templateUrl: './regex.component.html',
  styleUrls: ['./regex.component.css']
})
export class RegexComponent implements OnInit {


  changedRegex: string[];

  regexTypes: RegexType[];

  regexItems: RegexObj[] = [];

  filterItems: RegexObj[] = [];

  filterType: any = -1;

  filterString: string = ""

  constructor(private _matDialog: MatDialog, private regexService: RegexService) { }


  ngOnInit() {
    this.getRegex();
  }

  getRegex() {
    this.regexService.getAll().subscribe(result => {
      if (result[0]) {
        this.assignData(result[1]);
      }
    });
  }
  assignData(data: any) {
    if (data) {
      this.regexTypes = data.types?.map(type => Object.assign(new RegexType(), type));
      this.regexItems = data.regex?.map(regexObj => Object.assign(new RegexObj(), regexObj));
      this.onFilter();
    }
  }


  onFilter() {

    this.filterItems = this.regexItems.filter((obj: RegexObj) =>
      obj.$value.toLowerCase().includes(this.filterString.toLowerCase()) &&
      (this.filterType == obj.$type_id || this.filterType == -1)
    );
  }

  getTypeName(id: string) {
    try {
      return this.regexTypes.find(type => type.$_id == id).$name
    } catch (error) {
      return "------"
    }
  }
  onAddRegex() {
    let regexObj: RegexObj = new RegexObj();
    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog
    dialogRef.afterClosed().subscribe((result: RegexObj) => {
      if (result) {
        this.regexService.add(result).subscribe(res => {
          if (res[0]) {
            this.getRegex();
          }
        });
      }
    });
  }

  onModify(event, regexObj: RegexObj) {
    event.stopPropagation();
    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog comes here.
    dialogRef.afterClosed().subscribe((result: RegexObj) => {

      if (result && JSON.stringify(result) != JSON.stringify(regexObj)) {
        this.regexService.modify(result).subscribe(res => {
          if (res[0]) {
            this.getRegex();
          }
        });
      }
    });
  }



  openDialog(regexObj: RegexObj) {
    //Open dialog box of DialogAddTool.html
    return this._matDialog.open(AddRegexDialog, {
      width: '400px',
      height: '400px',
      data: { regex: regexObj, types: this.regexTypes }
    });
  }

  onDelete(event, id: string) {
    event.stopPropagation();
    this.regexService.delete(id).subscribe(result => {
      if (result[0])
        this.deleteRegex(id);
    }
    );
  }

  deleteRegex(id: string) {
    this.regexItems = this.regexItems.filter(item => item.$_id != id);
    this.onFilter();
  }
}



//Form class
@Component({
  selector: 'add-regex',
  templateUrl: 'add-regex-form.html',
})

export class AddRegexDialog implements OnInit {
  regexObj: RegexObj;
  types: RegexType[];

  constructor(public dialogRef: MatDialogRef<RegexObj>,
    @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit(): void {

    // If Regex object received as parameter when user opens the dialog.
    // Otherwise it will initialize as new staff member.
    if (this.data) {
      /* Universal function to clone a object.
       Object.assign(Object.create(Object.getPrototypeOf(this.data)), this.data);
      */
      //Cloning the regex object to new object
      this.regexObj = Object.assign(new RegexObj(), this.data.regex);
      this.types = this.data.types;

    } else {
      //Initialize regex Obj.
      this.regexObj = new RegexObj();
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.regexObj);
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

}
