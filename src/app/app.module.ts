import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataControllerComponent } from './data-controller/data-controller.component';
import { FilesComponent } from './files/files.component';
import { TextBoxOrigComponent } from './text-box-orig/text-box-orig.component';
import { TextBoxTrgComponent } from './text-box-trg/text-box-trg.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DataControllerComponent,
    FilesComponent,
    TextBoxOrigComponent,
    TextBoxTrgComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
