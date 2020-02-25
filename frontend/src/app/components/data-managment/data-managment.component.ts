import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-managment',
  templateUrl: './data-managment.component.html',
  styleUrls: ['./data-managment.component.css']
})
export class DataManagmentComponent implements OnInit {
  itemList: any = [
    {
      value: "regex",
      icon: "edit"
    },
    {
      value: "data",
      icon: "local_library"
    },
    {
      value: "empty",
      icon: ""
    },
    {
      value: "empty",
      icon: ""
    },
    {
      value: "empty",
      icon: ""
    },
  ]
  constructor() { }

  ngOnInit() {
  }

}
