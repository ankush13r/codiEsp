import { Component, OnInit, Inject } from '@angular/core';
import { RegexObj } from 'src/app/models/regex/regex-obj';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { RegexType } from 'src/app/models/regex/regex-type';

@Component({
  selector: 'app-hpo-from',
  templateUrl: './hpo-from.component.html',
  styleUrls: ['./hpo-from.component.css']
})
export class HpoFromComponent implements OnInit {

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
