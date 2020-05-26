import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';


const modules = [
  BrowserAnimationsModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTabsModule,
  MatListModule,
  MatIconModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatRadioModule,
  MatSidenavModule,
  MatDividerModule,
  MatToolbarModule,
  MatSelectModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatGridListModule,
  ScrollingModule,
  FlexLayoutModule,
  MatSnackBarModule,
  MatCheckboxModule,
  DragDropModule,
  TableVirtualScrollModule,
  MatTableModule,
  MatSortModule,
  MatProgressBarModule,
  MatInputModule
]

@NgModule({
  declarations: [],
  imports: [
    modules
  ],
  exports: [
    modules
  ]
})
export class NgMaterialModule { }
