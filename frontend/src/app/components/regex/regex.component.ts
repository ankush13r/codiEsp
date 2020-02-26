import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-regex',
  templateUrl: './regex.component.html',
  styleUrls: ['./regex.component.css']
})
export class RegexComponent implements OnInit {
  
  @Input() RexesType:string;
  
  items:any[];
  filterItem:any[];
  
  
  constructor() { }


  ngOnInit() {
    this.items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    this.filterItem = this.items;
  }


  onFilter(event:string){
    this.filterItem = this.items.filter((result:string)=> result.toLowerCase().includes(event.toLowerCase()));
  }
}
