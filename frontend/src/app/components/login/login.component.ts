import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../../services/authentication.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { User } from 'src/app/models/user/user';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
  user: User;
  passwordType: string = "password"
  error = null;

  constructor(
    private authenticationService: AuthenticationService,
    public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.user = new User();
  }

  // convenience getter for easy access to form fields

  onSubmit() {
    this.authenticationService.login(this.user.$email, this.user.$password)
      .pipe(first())
      .subscribe(
        data => {         
          if(data[0]){
            this.dialogRef.close();
          }else{
          this.error = data[1];
          }
        },
        error => {
          this.error = "Internal server error. Please try again later or contact us.";
        });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePasswordType() {
    this.passwordType = this.passwordType == "password" ? "text" : "password"
  }
}