import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from './services/api-docs.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  documents_types: String[] = ["pdf", "html", "link"]

  constructor(private apiService:ApiService) {

  }

  ngOnInit() {   
    this.apiService.getIp();
  }

}
