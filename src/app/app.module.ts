import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataControllerComponent } from './data-controller/data-controller.component';
import { FilesComponent } from './files/files.component';
import { TextBoxOrigComponent } from './source-data/source-data.component';
import { TextBoxTrgComponent } from './target-data/target-data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DataControllerComponent,
    FilesComponent,
    TextBoxOrigComponent,
    TextBoxTrgComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
