import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatPaginatorModule, MatTabsModule, MatListModule, MatIconModule,
  MatButtonModule, MatSlideToggleModule, MatRadioModule,
  MatSidenavModule, MatDividerModule, MatToolbarModule, MatSelectModule,
  MatChipsModule, MatAutocompleteModule, MatTooltipModule, MatProgressSpinnerModule,
  MatGridListModule, MatSnackBarModule, MatDialogModule, MatCheckboxModule,MatTableModule, MatSortModule
}
  from '@angular/material';

import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';


import { DragDropModule } from '@angular/cdk/drag-drop';

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
  MatSortModule
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
