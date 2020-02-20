import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
  }

}
