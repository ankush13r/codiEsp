import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { DataExtractorComponent } from '../components/data-extractor/data-extractor.component';

import { DataManagmentComponent } from '../components/data-managment/data-managment.component';



const routes: Routes = [
  {
    path: 'management',
    component: DataManagmentComponent
  },
  {
    path: 'docs',
    component: DataExtractorComponent,
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
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
