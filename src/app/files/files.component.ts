import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

import {DataControllerService} from '../data-controller.service';
import {FilesService} from "../files.service"

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  title = "Files";
  selectedFile :string;
  files : string[];
  
  constructor(private filesService: FilesService,private dataControllerService: DataControllerService) {

  }

  ngOnInit() {
    this.getFiles(); 
    this.getSelectedFile();
  }

  getFiles() {
    this.filesService.getFiles()
      .subscribe(files => this.files = files);
  }

  selectFile(file){
    this.dataControllerService.setSelectedFile(file)      
  }
  getSelectedFile(){
    this.dataControllerService.getSelectedFile().subscribe(result => {
      this.selectedFile = result}); 
  }
  myFun(d){
    console.log("·sssssssssss");
    
  }
}
