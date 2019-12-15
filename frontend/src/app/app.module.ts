import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DataControllerComponent } from './parent/parent.component';
import { FilesComponent } from './files/files.component';
import { SourceDataComponent } from './source-data/source-data.component';
import { TargetDataComponent } from './target-data/target-data.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DataControllerComponent,
    FilesComponent,
    SourceDataComponent,
    TargetDataComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
