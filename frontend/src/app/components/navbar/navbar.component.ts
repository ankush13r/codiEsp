import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { MatDialog } from '@angular/material';
import { LoginComponent } from '../login/login.component';
import { User } from '../../../app/models/user/user';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User;

  components: object[] = [
    {
      name: "Home",
      root: "docs",
      icon: ""
    },
    {
      name: "management",
      root: "management",
      icon: ""
    }
  ]



  constructor(public auth: AuthenticationService, private dialog: MatDialog) { }

  ngOnInit() {
    this.auth.currentUser.subscribe(user => {
      if (user)
        this.currentUser = Object.assign(new User(), user);
      else
        this.currentUser = null;
    });

  }

  get isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  login() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      height: '350px',
      data: { user: new User() }
    })
  }

  logout() {
    this.auth.logout();
  }
}
