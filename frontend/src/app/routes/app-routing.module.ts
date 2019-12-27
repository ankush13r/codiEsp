import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilesComponent } from '../components/files/files.component';
import { TargetDataComponent} from '../components/target-data/target-data.component';


const routes: Routes = [
  { path: 'documents', component: FilesComponent },
  { path: '', redirectTo: '/documents', pathMatch: 'full' },
  { path: 'file/:id', component: FilesComponent  },
  { path: 'file/:id', component: TargetDataComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
