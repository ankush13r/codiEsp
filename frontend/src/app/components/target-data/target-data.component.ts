import { Component, OnInit } from '@angular/core';

import { DataControllerService } from '../../services/data-controller.service';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-target-data',
  templateUrl: './target-data.component.html',
  styleUrls: ['./target-data.component.css']
})
export class TargetDataComponent implements OnInit {
  title = "Target"
  file: string = null;
  isFoundData: boolean = false;
  targetText: string = null;

  constructor(
    private dataControllerService: DataControllerService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getSelectedFile();
    this.geTIsFoundData();
    this.getTargetText();
  }

  getSelectedFile() {
    this.dataControllerService.getSelectedFile().subscribe(result => {
      if (this.file !== result) {
        this.file = result
      }
    });
  }
  geTIsFoundData() {
    this.dataControllerService.getIsFoundData().subscribe(result => {
      this.isFoundData = result;
    });
  }
  getTargetText() {
    this.dataControllerService.getTargetText().subscribe(result => {
      this.targetText = result;
    });
  }
  setTargetText(text: string) {
    if (text) {
      text = text.trim()
    }
    this.dataControllerService.setTargetText(text);
  }

  searchData() {
    this.setTargetText(this.apiService.getData());
  }

  submitData() {
    this.apiService.setData();
  }
  removeData() {
    this.apiService.removeData();
  }
  modifyData() {
    this.apiService.modifyData();
  }

  
}
