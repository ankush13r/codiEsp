import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { TextExtractorComponent } from '../components/text-extractor/text-extractor.component';

import { DataManagmentComponent } from '../components/data-managment/data-managment.component';
import { RegexComponent } from '../components/regex/regex.component';
import { ClinicalDataComponent } from '../components/clinical-data/clinical-data.component';




const routes: Routes = [
  {
    path: 'management',
    component: DataManagmentComponent,
    children: [
      {
        path: 'regex',
        component: RegexComponent,
      },
      {
        path: 'clinical_data',
        component: ClinicalDataComponent,
      },
      {
        path: '',
        redirectTo: 'clinical_data',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'docs',
    component: TextExtractorComponent,
    //<---- child components declared here
    children: [
      {
        path: ':type',
        component: DocumentsComponent,
      },
    ]
  },
  {
    path: '',
    redirectTo: 'docs',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
