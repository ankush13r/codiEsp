import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

/**
 * @title Chips Autocomplete
 */
@Component({
  selector: 'app-chips-list',
  templateUrl: 'chips-list.component.html',
  styleUrls: ['chips-list.component.css'],
})
// ChipsAutocompleteExample
export class ChipsListComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formCtrl = new FormControl();
  filteredValues: Observable<string[]>;
  @Input() selectedValues: string[] = [];
  @Input() dataList: string[] = [];

  @ViewChild('chipsInput', null) chipsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', null) matAutocomplete: MatAutocomplete;

  constructor() {

  }

  ngOnInit() {
    //pipe create an observable, than it can be synchronized be html
    this.filteredValues = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => value && value.length > 3 ? this._filter(value) : null));      
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;
  //   console.log(value);
    
  //   // Add the value into the selectedValues. If value is null it will check for empty, with it i prevent errors
  //   if ((value || '').trim()) {
  //     this.selectedValues.push(value.trim());
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }

  //   this.formCtrl.setValue(null);
  // }

  remove(value: string): void {
    //Remove the element by value
    const index = this.selectedValues.indexOf(value);
    //If value exists
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    //Push selected value to the
    this.selectedValues.push(event.option.value);
    this.chipsInput.nativeElement.value = '';
    this.formCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dataList.filter((value: Object) => {
      return (value["name"].toLowerCase().indexOf(filterValue) === 0)||
      (value["synonyms"].some(synonym => synonym.toLowerCase().indexOf(filterValue) === 0)
      )
    });
  }
}