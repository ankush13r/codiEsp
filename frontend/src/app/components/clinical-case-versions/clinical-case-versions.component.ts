import { Component, OnInit } from '@angular/core';
import { DataShareService } from '../../services/data-share.service';
import { FileObj } from 'src/app/interfaces/file-obj';


@Component({
  selector: 'app-clinical-case-versions',
  templateUrl: './clinical-case-versions.component.html',
  styleUrls: ['./clinical-case-versions.component.css']
})
export class ClinicalCaseVersionsComponent implements OnInit {
  title = "All versions"
  document: FileObj;
  list = ["Source"]
  constructor(private dataShareService: DataShareService) { }

  ngOnInit() {
    this.getSelectedFile();
  }

  getSelectedFile() {
    this.dataShareService.getSelectedFile().subscribe(result => {

      if (this.document !== result && result) {
        this.document = result;
        if (this.document.old_versions) {
          this.document.old_versions.sort((a,b)=> a["time"]-b["time"])
        }
      }
    });
  }

}
