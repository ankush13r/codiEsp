import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  templateUrl: './sub-title.component.html',
  styleUrls: ['./sub-title.component.css']
})
export class SubTitleComponent implements OnInit {
  @Input() title;
  constructor() { }

  ngOnInit() {
  }

}
