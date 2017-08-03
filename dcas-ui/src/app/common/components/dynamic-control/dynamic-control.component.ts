import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { FormGroup } from '@angular/forms';
import { UiKitControlConfig } from './../../../ui-kit/models/ui-kit-control-config';
import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'dcas-dynamic-control',
  template: `
    <ng-container *ngIf="isControlHidden" uiKitDynamicControl [config]="config" [group]="formGroup"></ng-container>
    <div [ngClass]="groupCss" *ngIf="!isControlHidden">
        <label [ngClass]="labelCss" [localize]="config.name"></label>
        <ng-container uiKitDynamicControl [config]="config" [group]="formGroup"></ng-container>
    </div>
  `
})
export class DynamicControlComponent implements OnChanges {

  @Input()
  groupCss: string;
  @Input()
  labelCss: string;
  @Input()
  config: UiKitControlConfig;
  @Input()
  formGroup: FormGroup;

  constructor() {
    this.groupCss = "form-group col-xs-12 col-md-6";
  }
  isControlHidden: boolean;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.config.currentValue) {
      this.isControlHidden = changes.config.currentValue.type == UiKitControlType.hidden;
    }
  }
}
