import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { MainComponent } from '../components/main/main.component';

import { clinicalCase } from '../components/target/target.component';



const routes: Routes = [
  //<---- child components declared here
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: 'documents/:type',
        component: DocumentsComponent,
      },
      {
        path: ':case',
        component: clinicalCase,
        outlet: 'case'
      },
    ]
  },
  {
    path: '',
    redirectTo: 'main/documents/pdf',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
