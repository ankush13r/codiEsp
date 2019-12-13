import { Component, OnInit } from '@angular/core';
import {DataControllerService} from '../data-controller.service';


@Component({
  selector: 'app-data-controller',
  templateUrl: './data-controller.component.html',
  styleUrls: ['./data-controller.component.css']
})
export class DataControllerComponent implements OnInit {

  selectedFile :string;
  files : string[];
  constructor(private dataControllerService: DataControllerService) {

  }

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.dataControllerService.getFiles()
      .subscribe(files => this.files = files);     
  }

  selectFile(file){
    this.selectedFile = file;
    console.log(this.selectedFile);
    
  }


}
