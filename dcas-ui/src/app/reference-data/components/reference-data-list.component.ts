import { DateService } from './../../common/services/date-service';
import { EnumExtensions } from './../../common/classes/enum-extensions';
import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { UiKitControlConfig } from './../../ui-kit/models/ui-kit-control-config';
import { ReferenceDataAction, ReferenceDataActionType } from './../models/reference-data-action';
import { IReferenceData } from './../models/reference-data';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Sort } from "app/common/models/sort";

@Component({
  selector: 'dcas-reference-data-list',
  templateUrl: './reference-data-list.component.html'
})
export class ReferenceDataListComponent {

  constructor(private dateService:DateService){}

  sort: Sort = new Sort();

  @Input()
  data: IReferenceData[];

  @Input()
  configs:UiKitControlConfig[];

  @Input()
  isLoading: boolean;

  actions:ReferenceDataAction[];

  @Output()
  onAction: EventEmitter<ReferenceDataAction> = new EventEmitter<ReferenceDataAction>();

  @Output()
  onSortChanged: EventEmitter<Sort> = new EventEmitter<Sort>();

  activeMenuItem: IReferenceData;

  uiKitControlType(property:UiKitControlType){
    return UiKitControlType[property];
  }

  onMenuClose() {
    this.activeMenuItem = null;
  }

  rowClickForItem(item: IReferenceData) {
    this.onAction.emit(new ReferenceDataAction(ReferenceDataActionType.view, item));
  }
  menuClickForItem(event, item: IReferenceData) {
    event.stopPropagation();
    this.activeMenuItem = item;
    this.actions = ReferenceDataAction.getActionsForItem(item, this.dateService.today)
                                      .filter(a => !a.disabled && a.type != ReferenceDataActionType.submit && a.type != ReferenceDataActionType.save);
  }
  onActionClick(action: ReferenceDataAction) {
    this.onAction.emit(action);
  }

  sortBy(prop: string) {
    let reset = false;
    if (this.sort.by === prop) {
      if(this.sort.asc === true)
        this.sort.asc = false;
      else{
        reset = true;
      }
    } else {
      this.sort.asc = true;
    }
    if(reset) this.sort = new Sort();
    else this.sort.by = prop;
    this.onSortChanged.emit(this.sort);
  }
}
