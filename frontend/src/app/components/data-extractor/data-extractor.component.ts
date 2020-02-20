import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';
import { ResizeEvent } from 'angular-resizable-element'
import { ApiService } from '../../services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './data-extractor.component.html',
  styleUrls: ['./data-extractor.component.css']
})
export class DataExtractorComponent implements OnInit {
  documents_types: String[] = null;
  selected_type: String;

  constructor(private dataShare: DataShareService, private apiService: ApiService,
    private activateRoute: ActivatedRoute, private router: Router, private cookies: CookieService) {

  }

  ngOnInit() {
    this.getTypes();

  }

  // selectType(type) {
  //   if(type!= this.selected_type)
  //     this.dataShare.selectDocumentType(type)
  // }


  getTypes() {
    this.apiService.getTypes().subscribe(result => {
      this.documents_types = result;
      this.openRouterLink();
    });
  }


  openRouterLink() {
    let type = null;
    if (this.activateRoute.snapshot.firstChild) {
      type = this.activateRoute.snapshot.firstChild.params.type;
    }

    if (!type) {
      type = this.cookies.get("docType");
      this.router.navigate(["docs", type || this.documents_types[0]]);
    }
  }


  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }
}
