import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { UiKitControlConfig } from './../models/ui-kit-control-config';
import { FormGroup } from '@angular/forms';
import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ui-kit-input',
  template: `
    <div [formGroup]="group">
      <input
        [ngClass]="config.css"
        [type]="inputType"
        [attr.placeholder]="config.placeholder"
        [formControlName]="config.name" />
    </div>
  `
})
export class UiKitInputComponent {
  group: FormGroup;
  _config: UiKitControlConfig;
  inputType: string;

  set config(value: UiKitControlConfig) {
    this._config = value;
    if (value) {
      this.inputType = this.getInputType(value.type);
    }
  }
  get config(): UiKitControlConfig {
    return this._config;
  }


  getInputType(configType: UiKitControlType): string {
    switch (configType) {
      case UiKitControlType.number:
        return "number";
      case UiKitControlType.hidden:
        return "hidden";
      case UiKitControlType.password:
        return "password";
      default:
        return "text";
    }
  }
}
