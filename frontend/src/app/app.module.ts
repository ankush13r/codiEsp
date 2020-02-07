import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import {MatInputModule} from '@angular/material/input'; 
import { ClipboardModule } from 'ngx-clipboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatPaginatorModule, MatTabsModule, MatListModule, MatIconModule,
  MatButtonModule, MatSlideToggleModule, MatRadioModule,
  MatSidenavModule,MatDividerModule,MatToolbarModule,MatSelectModule

} from '@angular/material';

import { ResizableModule } from 'angular-resizable-element';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { clinicalCase } from './components/target/target.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { PaginationComponent } from './components/pagination/pagination.component';
import { MainComponent } from './components/main/main.component';
import { PreviewComponent } from './components/preview/preview.component';
import { TitleComponent } from './components/shared-com/title/title.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DocumentsComponent,
    clinicalCase,
    PaginationComponent,
    MainComponent,
    PreviewComponent,
    TitleComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule,
    
    BrowserAnimationsModule,
    FlexLayoutModule,
    ResizableModule,
    MatPaginatorModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatSelectModule,

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
