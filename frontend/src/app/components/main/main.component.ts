import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';
import { ResizeEvent } from 'angular-resizable-element'
  
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  documents_types: String[] = ["pdf", "html", "link"]
  selected_type: String;

  constructor(private dataShare: DataShareService) {

  }

  ngOnInit() {
    this.getDocsType();
  }

  // selectType(type) {
  //   if(type!= this.selected_type)
  //     this.dataShare.setDocType(type)
  // }

  getDocsType() {
    this.dataShare.getDocType().subscribe(type =>
      this.selected_type = type
    )
  }

  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }
}
