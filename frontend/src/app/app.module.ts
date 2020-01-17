import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { DocumentsComponent } from './components/documents/documents.component';
import { clinicalCase } from './components/clinical-case/clinical-case.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { PaginationComponent } from './components/pagination/pagination.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material';
import { MainComponent } from './components/main/main.component';
import { ClinicalCaseVersionsComponent } from './components/clinical-case-versions/clinical-case-versions.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DocumentsComponent,
    clinicalCase,
    PaginationComponent,
    MainComponent,
    ClinicalCaseVersionsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
