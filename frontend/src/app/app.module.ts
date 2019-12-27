import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DataControllerComponent } from './components/parent/parent.component';
import { FilesComponent } from './components/files/files.component';
import { SourceDataComponent } from './components/source-data/source-data.component';
import { TargetDataComponent } from './components/target-data/target-data.component';
import { AppRoutingModule } from './routes/app-routing.module';


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
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
