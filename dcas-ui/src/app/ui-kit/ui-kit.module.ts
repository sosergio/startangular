import { UiKitSelectComponent } from './components/ui-kit-select.component';
import { UiKitDynamicControl } from './directives/ui-kit-dynamic-control.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { UiKitDatePickerComponent } from './components/ui-kit-date-picker.component';
import { UiKitInputComponent } from './components/ui-kit-input.component';
import { NgModule } from '@angular/core';
import { MdButtonModule, MdCheckboxModule, MdInputModule, MdSelectModule, MdMenuModule, MdSnackBarModule, MdDatepickerModule, MdNativeDateModule, MdSlideToggleModule, MdDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

let modules = [
  BrowserModule,
  BrowserAnimationsModule,
  MdButtonModule,
  MdCheckboxModule,
  MdInputModule,
  MdSelectModule,
  MdMenuModule,
  MdSnackBarModule,
  MdDatepickerModule,
  MdNativeDateModule,
  MdDialogModule,
  MdSlideToggleModule,
  ReactiveFormsModule,
];
let entryComponents =[
  UiKitInputComponent,
  UiKitDatePickerComponent,
  UiKitSelectComponent
];
let components = [
  UiKitDynamicControl,
];
@NgModule({
  declarations: [
    components,
    entryComponents
  ],
  imports: modules,

  exports: [
    modules,
    components,
    entryComponents
  ],
  entryComponents: [
    entryComponents
  ]
})
export class UiKitModule { }
