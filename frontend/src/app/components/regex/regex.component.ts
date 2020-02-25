import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-regex',
  templateUrl: './regex.component.html',
  styleUrls: ['./regex.component.css']
})
export class RegexComponent implements OnInit {
  items:any;
  constructor() { }

  ngOnInit() {
    this.items = Array.from({length: 100000}).map((_, i) => `Item #${i}`);
    console.log(this.items);
    
  }

}
