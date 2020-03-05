import { Component, OnInit, Input, Inject } from '@angular/core';

import { RegexObj } from '../../models/regex/regex-obj';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiRegexService } from '../../services/api-regex.service';
import { ApiResponseRegex } from '../../models/regex/api-response-regex';
import { RegexType } from 'src/app/models/regex/regex-type';


@Component({
  selector: 'app-regex',
  templateUrl: './regex.component.html',
  styleUrls: ['./regex.component.css']
})
export class RegexComponent implements OnInit {


  changedRegex: string[];

  regexApiResponse: ApiResponseRegex = null;

  filterItems: RegexObj[] = [];

  filterType: any = -1;

  filterString:string = ""

  constructor(private _matDialog: MatDialog, private regexService: ApiRegexService) { }


  ngOnInit() {
    this.regexService.getAll().subscribe(result => {
      this.regexApiResponse = result;
      this.filterItems = Object.assign([], this.regexApiResponse.$regexList);
    });
  }


  onFilter() {
    console.log(this.filterString);
    
    this.filterItems = this.regexApiResponse.$regexList.filter((obj: RegexObj) =>
      obj.$value.toLowerCase().includes(this.filterString.toLowerCase()) && 
      (this.filterType == obj.$type || this.filterType == -1)
      );
  }

  getTypeName(id: string) {
    return this.regexApiResponse.$types.find(type => type.$_id == id).$name
  }
  onAddRegex() {
    let regexObj: RegexObj = new RegexObj();
    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog
    dialogRef.afterClosed().subscribe((result: RegexObj) => {
      if (result) {
        this.regexService.add(result).subscribe(res => {
          this.regexApiResponse.$regexList.push(res);
          this.filterItems = [...this.filterItems, res]
        });
      }
    });
  }

  onModify(event, regexObj: RegexObj) {
    event.stopPropagation();
    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog comes here.
    dialogRef.afterClosed().subscribe((result: RegexObj) => {

      if (result) {
        this.regexService.add(result).subscribe(res => {
          Object.assign(regexObj, res);
        });
      }
    });
  }

  openDialog(regexObj: RegexObj) {
    //Open dialog box of DialogAddTool.html
    return this._matDialog.open(AddRegexDialog, {
      width: '400px',
      height: '400px',
      data: { regex: regexObj, types: this.regexApiResponse.$types }
    });
  }

  onDelete(event, id: number) {
    event.stopPropagation();
    console.log(id);
  }
}
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
      //Initialize staff member.
      this.regexObj = new RegexObj();
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.regexObj);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
