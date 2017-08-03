import { UiKitSelectComponent } from './../components/ui-kit-select.component';
import { UiKitControlConfig, UiKitControlType } from './../models/ui-kit-control-config';
import { ComponentFactoryResolver, Directive, Input, OnInit, ViewContainerRef, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { UiKitDatePickerComponent } from './../components/ui-kit-date-picker.component';
import { UiKitInputComponent } from './../components/ui-kit-input.component';


@Directive({
  selector: '[uiKitDynamicControl]'
})
export class UiKitDynamicControl implements OnInit, OnChanges {

  @Input()
  config: UiKitControlConfig;

  @Input()
  group: FormGroup;

  component;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) { }

  ngOnInit() {
    let component;
    switch (this.config.type) {
      case UiKitControlType.date:
        component = UiKitDatePickerComponent;
        break;
      case UiKitControlType.select:
        component = UiKitSelectComponent;
        break;
      default:
        component = UiKitInputComponent;
    }
    const factory = this.resolver.resolveComponentFactory<any>(component);
    this.component = this.container.createComponent(factory);
    this.component.instance.config = this.config;
    this.component.instance.group = this.group;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && !changes.config.isFirstChange()){
      this.component.instance.config = changes.config.currentValue;
    }
  }
}
