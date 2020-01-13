import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocumentsComponent } from '../components/documents/documents.component';
import { clinicalCase} from '../components/clinical-case/clinical-case.component';


const routes: Routes = [
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'documents', component: DocumentsComponent },
  { path: 'file/:id', component: DocumentsComponent },
  { path: 'file/:id', component: clinicalCase },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
