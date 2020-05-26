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
      name: "clinical data",
      path: "clinical_data",
      icon: "local_library"
    },
    {
      name: "regex",
      path: "regex",
      icon: "*edit",
    }
   
  ]
  constructor() { }

  ngOnInit() {
  }


}
