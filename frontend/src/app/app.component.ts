import { Component, OnInit, Input } from '@angular/core';
import { DocsService } from './services/docs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  documents_types: String[] = ["pdf", "html", "link"]

  constructor(private service:DocsService) {

  }

  ngOnInit() {   
    this.service.getIp();
  }

}
