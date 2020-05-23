import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';
import { ResizeEvent } from 'angular-resizable-element'
import { DocsService } from '../../services/docs.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-main',
  templateUrl: './text-extractor.component.html',
  styleUrls: ['./text-extractor.component.css']
})
export class TextExtractorComponent implements OnInit {
  documents_types: String[] = null;
  selected_type: String;

  constructor(private dataShare: DataShareService, private service: DocsService,
    private activateRoute: ActivatedRoute, private router: Router, private cookies: CookieService) {

  }

  ngOnInit() {
    this.getTypes();
  }

  getTypes() {
    this.service.getTypes().subscribe(result => {
      this.documents_types = result;
      if (this.documents_types?.length > 0) {
        this.openRouterLink();
      } else {
        alert("Error: there is no date to provide.")
      }
    });
  }


  openRouterLink() {

    let type = null;
    if (this.activateRoute.snapshot.firstChild) {
      type = this.activateRoute.snapshot.firstChild.params.type;
    }
    console.log(type);

    if (!type) {

      type = this.cookies.get("docType");
      this.router.navigate(["docs", type || this.documents_types[0]]);
    }
  }


  onResizeEnd(event: ResizeEvent): void {
    console.log('Element was resized', event);
  }
}
