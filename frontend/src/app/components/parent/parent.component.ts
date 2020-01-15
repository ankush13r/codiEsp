import { Component, OnInit, Input } from '@angular/core';
// import {DataControllerService} from '../../services/data-controller.service';


@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class Parent implements OnInit {

  documents_types: String[] = ["pdf","html","link"]
  selected_type: String = null;

  constructor() {

  }

  ngOnInit() {

  }

  selectType(type){
    this.selected_type = type;  
  }





}
