import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() length = 0;
  @Input() pageIndex;
  @Input() pageSize;
  pageSizeOptions: number[] = [10, 25, 50, 100];

  // MatPaginator Output
  @Output() pageEvent = new EventEmitter();

  constructor(private dataShareService: DataShareService) {

  }

  ngOnInit() {
    // this.getPaginationEvent();
  }


  setPageEvent(event) {
    this.pageEvent.emit(event)
  }

  // getPaginationEvent() {
  //   this.dataShareService.getPaginationEvent().subscribe(result => {
  //     this.pageEvent = result
  //   });
  // }

}
