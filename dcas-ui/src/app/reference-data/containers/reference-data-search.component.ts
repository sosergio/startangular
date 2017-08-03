import { DialogsService } from './../../common/services/dialogs.service';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AppConfigService } from './../../common/services/app-config.service';
import { Sort } from './../../common/models/sort';
import { ApiSearchResponse } from './../../common/models/api-response';
import { ReferenceDataStatus } from 'app/reference-data/models/reference-data';
import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { UiKitControlConfig } from './../../ui-kit/models/ui-kit-control-config';
import { ReferenceDataJsonSchemasService } from './../services/reference-data-json-schemas.service';
import { EnumExtensions } from './../../common/classes/enum-extensions';
import { NotificationService } from './../../common/services/notification-service';
import { ApplicationError } from './../../common/models/errors';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';
import { ReferenceDataService } from './../services/reference-data.service';
import { Router } from '@angular/router';
import { ReferenceDataAction, ReferenceDataActionType } from './../models/reference-data-action';
import { IReferenceData } from './../models/reference-data';
import { Component, ViewChild, ContentChild, TemplateRef } from '@angular/core';


@Component({
  selector: 'dcas-reference-data-search',
  templateUrl: "./reference-data-search.component.html"
})
export class ReferenceDataSearchComponent {

  response: ApiSearchResponse<IReferenceData[]>;
  request: ReferenceDataSearchRequest;
  isLoading: boolean;
  objectTypes: string[];
  configs: UiKitControlConfig[];
  allStatuses: any[];

  constructor(
    private referenceDataJsonSchemaService: ReferenceDataJsonSchemasService,
    private referenceDataService: ReferenceDataService,
    private router: Router,
    private notificationService: NotificationService,
    private appConfig: AppConfigService,
    private dialogsService: DialogsService) {
    this.request = new ReferenceDataSearchRequest();
    this.request.objectType = 'business';
    this.request.count = this.appConfig.environment.listPageSize;
    this.request.offset = 0;
    this.request.includeAllVersions = false;
    this.loadData(true);
    this.loadControlConfigs();

    this.objectTypes = referenceDataJsonSchemaService.getAllSchemasNames();
    this.allStatuses = EnumExtensions.convertToArray(ReferenceDataStatus);
  }

  onRequestChange(event) {
    this.loadData(true);
  }

  onSortChanged(event: Sort) {
    this.request.orderBy = event.by;
    this.request.ascendent = event.asc;
    this.loadData(true);
  }

  onTypeChange(event) {
    this.loadControlConfigs();
    this.loadData(true);
  }

  allItemsLength: number;
  loadData(resetOffset?: boolean) {
    let self = this;
    if (resetOffset) {
      this.request.offset = 0;
    }
    this.referenceDataService.search(this.request)
      .subscribe(response => {
        this.response = response;
        this.isLoading = false;
      }, error =>
        this.notificationService.error('There was an error loading the items.'));
  }

  loadControlConfigs() {
    let cc = this.referenceDataJsonSchemaService.getControlsConfigsForType(this.request.objectType, null)
      .filter(c => (c.name == "approvalStatusId" && this.request.includeAllVersions)
                  || (c.name != "reasonForRejection" && c.name != "reasonForWithdrawal"
                      && c.type != UiKitControlType.hidden && c.type != UiKitControlType.select));
    console.log(cc);
    this.configs = cc;
  }

  onPageChanged(page: number) {
    this.request.offset = this.request.count * (page - 1);
    this.loadData();
  }
}
