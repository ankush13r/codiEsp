import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

import {DataControllerService} from '../../services/data-controller.service';
import {ApiService} from "../../services/api.service"
import { FilesObj } from 'src/app/interfaces/files-obj';
import { FileObj } from 'src/app/interfaces/file-obj';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  title = "Files";
  selectedFile :FileObj;
  data : FilesObj
  
  constructor(private apiService: ApiService,private dataControllerService: DataControllerService) {

  }

  ngOnInit() {
    this.getFiles(); 
    this.getSelectedFile();
  }

  getFiles() {
    this.apiService.getFiles()
      .subscribe(files => this.data = files);
  }

  selectFile(file){
    this.dataControllerService.setSelectedFile(file)      
  }
  getSelectedFile(){
    this.dataControllerService.getSelectedFile().subscribe(result => {
      this.selectedFile = result}); 
  }

}
