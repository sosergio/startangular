import { DateService } from './../../common/services/date-service';
import { ReferenceDataAction, ReferenceDataActionType } from './../models/reference-data-action';
import { UiKitSelectOption } from './../../ui-kit/components/ui-kit-select.component';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';
import { UiKitControlConfig } from './../../ui-kit/models/ui-kit-control-config';
import { UiKitControlType } from 'app/ui-kit/models/ui-kit-control-config';
import { ReferenceDataService } from './../services/reference-data.service';
import { ReferenceDataJsonSchemasService } from './../services/reference-data-json-schemas.service';
import { Router } from '@angular/router';
import { NotificationService } from './../../common/services/notification-service';
import { EnumExtensions } from './../../common/classes/enum-extensions';
import { NotFoundError } from './../../common/models/errors';
import { ResolveResult } from './../../common/models/resolve-result';
import { ActivatedRoute } from '@angular/router';
import { IReferenceData, ReferenceDataStatus } from './../models/reference-data';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'dcas-reference-data-detail',
  templateUrl: "./reference-data-detail.component.html"
})
export class ReferenceDataDetailComponent implements OnInit {

  referenceDataForm: FormGroup;
  objectTypes: any;
  controlsConfig: UiKitControlConfig[];
  actions:ReferenceDataAction[];
  currentAction:ReferenceDataAction;
  isSaveDisabled:boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private referenceDataService: ReferenceDataService,
    private referenceDataJsonSchemasService: ReferenceDataJsonSchemasService,
    private dateService:DateService) {

    this.objectTypes = referenceDataJsonSchemasService.allSchemasNames;
  }

  ngOnInit() {
    let resolveResult = <ResolveResult<IReferenceData>>this.route.snapshot.data.resolveResult;
    let data: IReferenceData;
    if (resolveResult) {
      data = resolveResult.data;
      if (resolveResult.error) {
        throw resolveResult.error;
      }
    }
    let isCopy = this.route.snapshot.data.copy;
    console.log(this.route.snapshot);
    if(isCopy && data){
      delete data.id;
      data.approvalStatusId = ReferenceDataStatus.draft;
    }
    else if (!data) {
      data = {
        objectType: this.objectTypes[0],
        approvalStatusId: ReferenceDataStatus.draft
      };
    }
    let allActions = ReferenceDataAction.getActionsForItem(data, this.dateService.today);
    this.isSaveDisabled = allActions.find(a => a.type === ReferenceDataActionType.save).disabled;
    this.actions = allActions.filter(a => !a.disabled && a.type != ReferenceDataActionType.save && a.type != ReferenceDataActionType.view);
    this.controlsConfig = this.createControlConfigs(data.objectType, data);
    this.referenceDataForm = this.createFormWithConfigs(this.controlsConfig);
  }

  onTypeChange() {
    let tpp = this.referenceDataForm.get("objectType").value;
    let data = {
      objectType: tpp,
      approvalStatusId: ReferenceDataStatus.draft
    };

    this.controlsConfig = this.createControlConfigs(tpp, data);
    this.referenceDataForm = this.createFormWithConfigs(this.controlsConfig);
  }

  createControlConfigs(dataType: string, data: IReferenceData): UiKitControlConfig[] {
    let controlConfigs = this.referenceDataJsonSchemasService.getControlsConfigsForType(dataType, data);
    controlConfigs.forEach(config => {
        if (config.type === UiKitControlType.select) {
          this.loadOptionsForSelectControl(config);
        }
        config.css = "form-control";
        config.disabled = config.disabled || this.isSaveDisabled;
    });
    return controlConfigs;
  }

  createFormWithConfigs(configs: UiKitControlConfig[]): FormGroup {
    const group = this.fb.group({});
    configs.forEach(config => group.addControl(config.name, this.fb.control(config.toFormState())));
    return group;
  }

  loadOptionsForSelectControl(config: UiKitControlConfig) {
    let refType = this.referenceDataJsonSchemasService.propertyLinksToSchema(config.name);
    if (refType) {
      let request = new ReferenceDataSearchRequest();
      request.objectType = refType;
      request.includeAllVersions = true;
      this.referenceDataService.search(request).subscribe(response => {
        let data = response.data;
        config.options = data.map(d => <UiKitSelectOption>{
          key: d.id.toString(),
          value: d['name']
        });
      });
      return;
    }
    let enumerations = this.referenceDataJsonSchemasService.propertyEnumerations(config.name);
    if (enumerations) {
      config.options = enumerations;
    }
  }



  save() {
    let data = <IReferenceData>this.referenceDataForm.getRawValue();
    if (data.id) {
      this.referenceDataService.update(data)
        .subscribe(
          x => this.notificationService.success("Item updated with success."),
          error => this.notificationService.error(error));
    } else {
      this.referenceDataService.create(data)
        .subscribe(x =>
          this.router.navigate(['/reference-data',x.objectType,x.id])
            .then(()=> this.notificationService.success("Item created with success."))
          , error => this.notificationService.error(error));
    }
  }
}
