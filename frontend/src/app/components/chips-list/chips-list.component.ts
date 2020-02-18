import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, ViewChild, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import * as hpo from "../../../assets/hpo/hpo_es.json";

import { Hpo } from '../../interfaces/hpo';


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
  filteredValues: Observable<Hpo[]>;
  @Input() selectedValues: Hpo[] = [];
  @Input() disabled: boolean;

  allHpo: Hpo[];

  @ViewChild('chipsInput', null) chipsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', null) matAutocomplete: MatAutocomplete;

  constructor() {

  }

  ngOnInit() {
    //pipe create an observable, than it can be synchronized be html
    this.allHpo = hpo["default"];

    this.filteredValues = this.formCtrl.valueChanges.pipe(
      startWith(null),
      map((value: string | null) => value && value.length > 3 ? this._filter(value) : null));
  }


  remove(value: Hpo): void {
    //Remove the element by value
    const index = this.selectedValues.indexOf(value);
    //If value exists
    if (index >= 0) {
      this.selectedValues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    //Push selected value to the
    const index = this.selectedValues.indexOf(event.option.value);

    //If value doesn't exist
    if (index === -1)
      this.selectedValues.push(event.option.value);
    this.chipsInput.nativeElement.value = '';
    this.formCtrl.setValue(null);
  }

  private _filter(value: string): Hpo[] {
    const filterValue = value.toLowerCase();

    return this.allHpo.filter((hpo: Object) =>
      hpo["name"].toLowerCase().indexOf(filterValue) === 0 ||
      hpo["synonyms"].some(synonym => synonym.toLowerCase().indexOf(filterValue) === 0) ||
      (hpo["id"].toLowerCase().indexOf(filterValue) === 0 && filterValue.length > 8)
    );
  }


  isSelected(id: String) {
    return this.selectedValues.find(value => value.id === id) ? true : false;
  }
}