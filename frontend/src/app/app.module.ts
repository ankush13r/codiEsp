import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoaderInterceptor } from './interceptors/loader.interceptor'

import { CookieService } from 'ngx-cookie-service';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from 'ngx-clipboard';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { TargetComponent } from './components/target/target.component';
import { AppRoutingModule } from './routes/app-routing.module';
import { DataExtractorComponent } from './components/data-extractor/data-extractor.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SubTitleComponent } from './components/sub-title/sub-title.component';
import { HpoChipsListComponent } from './components/hpo-chips-list/hpo-chips-list.component';
import { DataManagmentComponent } from './components/data-managment/data-managment.component';
import { RegexComponent, AddRegexDialog } from './components/regex/regex.component';
import { TextareaHighlightComponent } from './components/textarea-highlight/textarea-highlight.component';
import { ReversePipe } from './pipes/reverse.pipe';

import { NgMaterialModule } from './modules/ng-material-cdk.module';
import { HighlightBreakLine } from './pipes/highlight-breakLine.pipe';
import { OrderObjListPipe } from './pipes/order-obj-list.pipe';

@NgModule({
  declarations: [
    ReversePipe,      
    AppComponent,
    NavbarComponent,
    DocumentsComponent,
    TargetComponent,
    DataExtractorComponent,
    PreviewComponent,
    SubTitleComponent,
    HpoChipsListComponent,
    DataManagmentComponent,
    AddRegexDialog,

    RegexComponent,
    TextareaHighlightComponent,
    HighlightBreakLine,
    OrderObjListPipe,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatInputModule,
    AppRoutingModule,
    HttpClientModule,
    ClipboardModule,
    ReactiveFormsModule,

    NgMaterialModule,

  ],
  entryComponents: [
    AddRegexDialog
  ],
  providers: [CookieService,   { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
