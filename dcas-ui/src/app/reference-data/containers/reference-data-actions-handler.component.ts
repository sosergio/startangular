import { LocalizeService } from './../../common/services/localize.service';
import { DialogsService } from './../../common/services/dialogs.service';
import { AppConfigService } from './../../common/services/app-config.service';
import { NotificationService } from './../../common/services/notification-service';
import { ReferenceDataService } from './../services/reference-data.service';
import { Router } from '@angular/router';
import { ReferenceDataAction, ReferenceDataActionType } from './../models/reference-data-action';
import { IReferenceData } from './../models/reference-data';
import { Component } from '@angular/core';


@Component({
  selector: 'dcas-reference-data-action-handler',
  template: ``
})
export class ReferenceDataActionHandlerComponent {

  constructor(
    private referenceDataService: ReferenceDataService,
    private router: Router,
    private notificationService: NotificationService,
    private appConfig: AppConfigService,
    private dialogsService: DialogsService,
    private localizeService:LocalizeService) {
  }


  public handle(action: ReferenceDataAction) {
    let objTypeDescr = this.localizeService.localize(action.data.objectType);
    switch (action.type) {
      case ReferenceDataActionType.amend:
      case ReferenceDataActionType.view:
        this.router.navigate(["/reference-data", action.data.objectType, action.data.id]);
        break;
      case ReferenceDataActionType.approve:
        this.dialogsService.confirm(`Approve ${objTypeDescr}`, "Do you confirm you want to approve this item?")
          .filter(confirmed => confirmed)
          .subscribe(() => this.notificationService.success(`${objTypeDescr} item has been approved.`));
        break;
      case ReferenceDataActionType.copy:
          this.router.navigate(["/reference-data", action.data.objectType, action.data.id, 'copy']);
        break;
      case ReferenceDataActionType.delete:
        this.dialogsService.prompt(`Delete ${objTypeDescr}`, "Please write the reason for deletion:")
          .filter(reason => reason != null)
          .map(reason => this.referenceDataService.delete(action.data.objectType, action.data.id, reason))
          .subscribe(x =>this.notificationService.success(`${objTypeDescr} item has been deleted.`));
        break;
      case ReferenceDataActionType.retract:
        this.dialogsService.prompt(`Retract ${objTypeDescr}`, "Please write the reason for retraction:")
          .filter(reason => reason != null)
          .subscribe(reason => {
            this.notificationService.success(`${objTypeDescr} item has been retracted.`);
          });
        break;
      case ReferenceDataActionType.reject:
        this.dialogsService.prompt(`Reject ${objTypeDescr}`, "Please write the reason for rejection:")
          .filter(reason => reason != null)
          .subscribe(reason => {
            this.notificationService.success(`${objTypeDescr} item has been rejected.`);
          });
        break;
      case ReferenceDataActionType.withdraw:
        this.dialogsService.prompt(`Withdraw ${objTypeDescr}`, "Please write the reason for withdrawal:")
          .filter(reason => reason != null)
          .subscribe(reason => {
              this.notificationService.success(`${objTypeDescr} item has been withdrawn.`);
          });
        break;
    }
  }
}
