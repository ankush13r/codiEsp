import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Parent } from '../components/parent/parent.component';
import { DocumentsComponent } from '../components/documents/documents.component';
import { clinicalCase } from '../components/clinical-case/clinical-case.component';



const routes: Routes = [
  {
    path: '',            //<---- parent component declared here
    component: Parent,
    children: [                          //<---- child components declared here
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'clinical',
        component: clinicalCase,
        outlet:'clinical'

      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
