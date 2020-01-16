import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { clinicalCase } from '../components/clinical-case/clinical-case.component';



const routes: Routes = [
  //<---- child components declared here
  {
    path: 'documents/:type',
    component: DocumentsComponent,
  },
  {
    path: ':link',
    component: clinicalCase,
    outlet: 'clinical_case'
  },
  {
    path: '**',
    redirectTo:  'documents/pdf',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
