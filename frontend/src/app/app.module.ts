import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import {MatInputModule} from '@angular/material/input'; 
import { ClipboardModule } from 'ngx-clipboard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatPaginatorModule, MatTabsModule, MatListModule, MatIconModule,
  MatButtonModule, MatSlideToggleModule, MatRadioModule,
  MatSidenavModule,MatDividerModule,MatToolbarModule,MatSelectModule,
  MatChipsModule,MatAutocompleteModule,MatTooltipModule
} from '@angular/material';

import { ResizableModule } from 'angular-resizable-element';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { TargetComponent } from './components/target/target.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { MainTextExtractorComponent } from './components/main-text-extractor/main-text-extractor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SubTitleComponent } from './components/sub-title/sub-title.component';
import { ChipsListComponent } from './components/chips-list/chips-list.component';

import { ReversePipe } from './pipes/reverse.pipe';

@NgModule({
  declarations: [
    ReversePipe,
    
    AppComponent,
    NavbarComponent,
    DocumentsComponent,
    TargetComponent,
    MainTextExtractorComponent,
    PreviewComponent,
    SubTitleComponent,
    ChipsListComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule,
    ReactiveFormsModule,
    
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
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule,

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
