import { UiKitControlConfig } from './../models/ui-kit-control-config';
import { Component, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { ControlValueAccessor } from "@angular/forms";
import { ReactiveFormsModule, NG_VALUE_ACCESSOR, FormGroup } from '@angular/forms';
import { NgModule, forwardRef } from '@angular/core';

@Component({
  selector: 'ui-kit-date-picker',
  template: `
    <div class="ui-kit-date-picker" [formGroup]="group">
      <input  [value]="date" [ngClass]="config?.css" placeholder="dd/mm/yyyy" [mdDatepicker]="myDatepicker" [formControlName]="config?.name">
      <button [disabled]="config?.disabled" [mdDatepickerToggle]="myDatepicker"><span class="material-icons">date</span></button>
    </div>
    <md-datepicker #myDatepicker (selectedChanged)="onDateChanged($event)"></md-datepicker>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiKitDatePickerComponent),
      multi: true
    }
  ]
})
export class UiKitDatePickerComponent implements ControlValueAccessor {
  group: FormGroup;
  config:UiKitControlConfig;

  writeValue(obj: any): void {
    this.date = obj;
  }
  registerOnChange(fn: any): void {
    //save the pointer to function
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState(isDisabled: boolean): void {
    this.config.disabled = isDisabled;
  }
  onDateChanged(event) {
    //because each browser could be set on a different timezone, we need to strip the timezone info from the date
    let month = event.getMonth() < 10 ? `0${event.getMonth()}` : event.getMonth();
    let day = event.getDate() < 10 ? `0${event.getDate()}` : event.getDate();
    this.date = new Date(`${event.getFullYear()}-${month}-${day}T00:00:00Z`);
    this.propagateChange(this.date);
  }

  propagateChange = (_: any) => { };

  date: Date;
}
