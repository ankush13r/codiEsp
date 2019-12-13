import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {
  title = "Files";
  @Input() files: string[];
  @Output() selected = new EventEmitter<string>();
  

  constructor() {

  }

  ngOnInit() {
  }

 
  onSelect(file: string) {
    this.selected.emit(file);
    
  }

}
