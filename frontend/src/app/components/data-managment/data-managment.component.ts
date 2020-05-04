import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-managment',
  templateUrl: './data-managment.component.html',
  styleUrls: ['./data-managment.component.css']
})
export class DataManagmentComponent implements OnInit {
  sortDrawer = true;

  itemList: any = [
    {
      name: "regex",
      path:"regex",
      icon: "edit",
      char: "*"
    },
    {
      name: "clinical data",
      path:"clinical_data",
      icon: "local_library"
    },
    {
      name: "empty",
      icon: "receipt"
    },
    {
      name: "empty",
      icon: ""
    },
    {
      name: "empty",
      icon: ""
    },
  ]
  constructor() { }

  ngOnInit() {
  }


}
