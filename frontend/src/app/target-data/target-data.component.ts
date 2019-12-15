import { Component, OnInit } from '@angular/core';

import { DataControllerService } from '../data-controller.service';

@Component({
  selector: 'app-target-data',
  templateUrl: './target-data.component.html',
  styleUrls: ['./target-data.component.css']
})
export class TargetDataComponent implements OnInit {
  title = "Target"
  file:string = null;
  isFoundData: boolean = false;

  constructor(private dataControllerService: DataControllerService) { }

    ngOnInit() {
      this.getSelectedFile();
      this.geTIsFoundData();
    }
  
    getSelectedFile() {
      this.dataControllerService.getSelectedFile().subscribe(result => {           
         if (this.file !== result) {
          this.file = result                          
        }
      });
    }
    geTIsFoundData(){
      this.dataControllerService.getIsFoundData().subscribe(result=>{
        this.isFoundData = result;
        console.log();
        
      });
    }
}
