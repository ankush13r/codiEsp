import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { DocumentsComponent } from '../components/documents/documents.component';
import { clinicalCase } from '../components/clinical-case/clinical-case.component';



const routes: Routes = [

  {
    path: 'documents/:type',
    component: DocumentsComponent,
  },
  {
    path: 'clinical',
    component: clinicalCase,
    outlet: 'clinical'

  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
