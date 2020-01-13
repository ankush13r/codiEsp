import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DataControllerComponent } from './components/parent/parent.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { clinicalCase } from './components/clinical-case/clinical-case.component';
import { AppRoutingModule } from './routes/app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DataControllerComponent,
    DocumentsComponent,
    clinicalCase,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
