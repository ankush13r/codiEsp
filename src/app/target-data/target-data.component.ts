import { Component, OnInit } from '@angular/core';

import { DataControllerService } from '../data-controller.service';

@Component({
  selector: 'app-target-data',
  templateUrl: './target-data.component.html',
  styleUrls: ['./target-data.component.css']
})
export class TextBoxTrgComponent implements OnInit {
  title = "Target"
  file:string;
  
  constructor(private dataControllerService: DataControllerService) { }

    ngOnInit() {
      this.getSelectedFile();
    }
  
    getSelectedFile() {
      this.dataControllerService.getSelectedFile().subscribe(result => {
        this.file = result;
      });
    }
}
