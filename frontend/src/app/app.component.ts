import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  documents_types: String[] = ["pdf","html","link"]
  selected_type: String = null;

  constructor() {

  }

  ngOnInit() {

  }

  selectType(type){
    this.selected_type = type;  
  }
}
