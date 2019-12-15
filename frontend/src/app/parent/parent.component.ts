import { Component, OnInit } from '@angular/core';
import {DataControllerService} from '../data-controller.service';


@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class DataControllerComponent implements OnInit {

  selectedFile : string;
  constructor(private dataControllerService: DataControllerService) {

  }

  ngOnInit() {

  }






}
