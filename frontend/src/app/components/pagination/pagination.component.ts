import { Component, OnInit,SimpleChange } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

import { DataShareService } from '../../services/data-share.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  
  pageEvent: PageEvent;

  constructor(private dataShareService: DataShareService) { 

  }

  ngOnInit() {
    // this.getPaginationEvent();
  }

  setPageEvent(event) {
    this.dataShareService.setPaginationEvent(event);
  }

  getPaginationEvent() {
    this.dataShareService.getPaginationEvent().subscribe(result => {
      this.pageEvent = result
    });
  }

}
