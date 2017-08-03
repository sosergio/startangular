import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { UiKitControlConfig } from './../models/ui-kit-control-config';
import { FormGroup } from '@angular/forms';
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

export class UiKitSelectOption{
  key:string;
  value:any;
}

@Component({
  selector: 'ui-kit-select',
  template: `
    <div [formGroup]="group">
      <select
        [ngClass]="config.css"
        [formControlName]="config.name">
        <option *ngFor="let o of config.options" [value]="o.key">{{o.value}}</option>
      </select>
    </div>
  `
})
export class UiKitSelectComponent implements OnChanges {
  config: UiKitControlConfig;
  group: FormGroup;
  ngOnChanges(changes: SimpleChanges): void {

  }

}
