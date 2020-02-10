import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { MainTextExtractorComponent } from '../components/main-text-extractor/main-text-extractor.component';

import { TargetComponent } from '../components/target/target.component';



const routes: Routes = [
  //<---- child components declared here
  {
    path: 'documents',
    component: MainTextExtractorComponent,
    children: [
      {
        path: ':type',
        component: DocumentsComponent,
      },
    ]
  },
  {
    path: '',
    redirectTo: 'documents/pdf',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
