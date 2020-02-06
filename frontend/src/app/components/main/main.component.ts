import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';
import { ResizeEvent } from 'angular-resizable-element'
import { ApiService } from '../../services/api.service';
  
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  documents_types: String[] = null;
  selected_type: String;

  constructor(private dataShare: DataShareService, private apiService:ApiService) {

  }

  ngOnInit() {
    this.getDocsType();
    this.getTypes();
  }

  // selectType(type) {
  //   if(type!= this.selected_type)
  //     this.dataShare.selectDocumentType(type)
  // }


  getTypes(){
    this.apiService.getTypes().subscribe(result=>{
      this.documents_types = result      
    }
      )
  }

  getDocsType() {
    this.dataShare.observeDocumentType().subscribe(type =>
      this.selected_type = type
    )
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }
}
