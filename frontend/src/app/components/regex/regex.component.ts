import { Component, OnInit, Input, Inject } from '@angular/core';

import { RegexType } from '../../models/regex-type';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ApiRegexService } from 'src/app/services/api-regex.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-regex',
  templateUrl: './regex.component.html',
  styleUrls: ['./regex.component.css']
})
export class RegexComponent implements OnInit {

  @Input() RexesType: string;

  items: RegexType[] = [];
  filterItems: RegexType[] = [];


  types: any = ["1", "2", "3"]


  filterType: any = -1;

  constructor(private _matDialog: MatDialog, private regexService: ApiRegexService) { }


  ngOnInit() {
    this.regexService.getAll().subscribe(result => {     
      this.items = result;     
      this.filterItems = this.items;
    });
  }


  onFilter(event: string) {
    this.filterItems = this.items.filter((obj: RegexType) => obj.$value.toLowerCase().includes(event.toLowerCase()));
  }


  onAddRegex() {
    let regexObj: RegexType = new RegexType();

    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog
    dialogRef.afterClosed().subscribe((result: RegexType) => {
      if (result) {
        this.regexService.add(result).subscribe(res => {
          console.log(res);
        });
      }
    });
  }

  onDelete(event, id: number) {
    event.stopPropagation();
    console.log(id);
  }

  onModify(event, regexObj: RegexType) {
    event.stopPropagation();
    const dialogRef = this.openDialog(regexObj)

    //When user close the dialog comes here.
    dialogRef.afterClosed().subscribe((result: RegexType) => {

      if (result) {
        console.log(result);
      }
    });
  }


  openDialog(regexObj: RegexType) {
    //Open dialog box of DialogAddTool.html
    return this._matDialog.open(AddRegexDialog, {
      width: '400px',
      height: '400px',
      data: regexObj
    });
  }
}


@Component({
  selector: 'add-regex',
  templateUrl: 'add-regex-form.html',
})

export class AddRegexDialog implements OnInit {
  regexObj: RegexType;
  types: string[] = ["ss", "aaa"]

  constructor(public dialogRef: MatDialogRef<RegexType>,
    @Inject(MAT_DIALOG_DATA) private data: RegexType) { }

  ngOnInit(): void {

    // If Regex object received as parameter when user opens the dialog.
    // Otherwise it will initialize as new staff member.
    if (this.data) {
      /* Universal function to clone a object.
       Object.assign(Object.create(Object.getPrototypeOf(this.data)), this.data);
      */
      //Cloning the regex object to new object
      this.regexObj = Object.assign(new RegexType(), this.data);
    } else {
      //Initialize staff member.
      this.regexObj = new RegexType();
    }
  }

  onSubmit(): void {
    this.dialogRef.close(this.regexObj);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
