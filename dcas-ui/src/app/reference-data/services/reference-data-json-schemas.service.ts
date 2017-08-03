import { EnumExtensions } from './../../common/classes/enum-extensions';
import { ApplicationError } from './../../common/models/errors';
import { IReferenceData } from './../models/reference-data';
import { LocalizeService } from './../../common/services/localize.service';
import { UiKitSelectOption } from './../../ui-kit/components/ui-kit-select.component';
import { UiKitControlConfig } from './../../ui-kit/models/ui-kit-control-config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { compile, compileFromFile } from 'json-schema-to-typescript'

import { Injectable } from '@angular/core';
import { UiKitControlType } from "app/ui-kit/models/ui-kit-control-config";

@Injectable()
export class ReferenceDataJsonSchemasService {

  constructor(private localizeService: LocalizeService) { }

  private onDataLoaded: Subject<any> = new BehaviorSubject<any>(null);
  onDataLoaded$ = this.onDataLoaded.asObservable();

  // a dictionary of objects<string,jsonSchema>
  allSchemas: any;
  allSchemasNames: string[];

  // a dictionary of objects<string,UiKitControlConfig>
  private schemasOverride: any;

  load(refDataSchemas, overrides): any {
    this.allSchemas = {};
    this.allSchemasNames = [];
    refDataSchemas.forEach(t => this.allSchemas[t.name]=t.schema);
    this.schemasOverride = overrides;
    this.allSchemasNames = refDataSchemas.map(t => t.name);
    this.onDataLoaded.next(this.allSchemas);
    return this.allSchemas;
  }

  getAllSchemasNames(): string[] {
    return this.allSchemasNames;
  }

  uiKitControlTypeForSchema(propertyName: string, schemaEntry: string): UiKitControlType {
    let type = schemaEntry['type'];
    let format = schemaEntry['format'];

    if (type == "string" && format == "date") {
      return UiKitControlType.date;
    } else if (type == "integer" && format == "int64") {
      if (this.propertyLinksToSchema(propertyName) || this.propertyEnumerations(propertyName)) {
        return UiKitControlType.select;
      }
      else {
        return UiKitControlType.number;
      }
    }
    return UiKitControlType.string;
  }

  propertyLinksToSchema(property: string): string {
    if (!property) return null;
    if (property.lastIndexOf("Id") != property.length - 2) return null;
    property = property.substring(0, property.length - 2);
    let parentKeyword = "parent";
    if (property.indexOf(parentKeyword) == 0) {
      property = property.substring(parentKeyword.length, property.length);
    };
    let dashCase = property.toDashCase();
    let found = this.allSchemasNames.indexOf(dashCase) != -1;
    return found ? dashCase : null;
  }

  propertyEnumerations(property: string): UiKitSelectOption[] {
    if (!property) return null;
    let key = `enumerations.${property}`;
    if (this.localizeService.hasKey(key)) {
      let enumerations = this.localizeService.localize(key);
      return Object.keys(enumerations).map(p => {
        let option = new UiKitSelectOption();
        option.key = p;
        option.value = enumerations[p];
        return option;
      });
    }
    else
      return null;
  }

  orderControlsForType(type: string, configs: UiKitControlConfig[]): UiKitControlConfig[] {
    let result: UiKitControlConfig[] = [];
    let grouped = configs.groupBy('type');
    Object.keys(grouped).forEach(tp => {
      result = result.concat(grouped[tp]);
    });

    let ordered = new Array<UiKitControlConfig>(result.length);
    for (let i = 0; i < result.length; i++) {
      let p = result[i];
      let overridenPosition = i;
      if (this.schemasOverride) {
        let star = this.schemasOverride["*"];
        let overridenType = this.schemasOverride[type];
        [star, overridenType].forEach(e => {
          if (e && e[p.name] && e[p.name].hasOwnProperty("order")) {
            overridenPosition = parseInt(e[p.name]["order"]);
          }
        });
      }
      if (overridenPosition != i) {
        if(overridenPosition >= result.length){
          throw new ApplicationError(`The overriden position ${overridenPosition} for ${p.name} in type ${type} is higher than the number of items ${result.length}. Order is zero-index based.`)
        }
        if(ordered[overridenPosition]){
          let nextFree = overridenPosition + 1;
          while(ordered[nextFree] && nextFree < ordered.length){
            nextFree++;
          }
          if(nextFree < ordered.length){
            overridenPosition = nextFree;
            p.order = nextFree;
          }
          else
            throw new ApplicationError(`Trying to put ${p.name} at index ${overridenPosition} in the ordered positions for type ${type}, but position is already taken by ${ordered[overridenPosition].name}.`)
        }
        ordered[overridenPosition] = p;
        result[i]=null;
      }
    }
    let ix = 0;
    for(let i=0; i<ordered.length;i++){
      if(!ordered[i]){
        let toCopy = null;
        while(toCopy==null && ix<result.length){
          toCopy = result[ix];
          ix++;
        }
        ordered[i]=toCopy;
      }
    }
    return ordered;
  }


  getControlsConfigsForType(dataType: string, data: IReferenceData): UiKitControlConfig[] {
    let jsonSchema = this.allSchemas[dataType];
    let controlsConfig = new Array<UiKitControlConfig>();
    if (jsonSchema) {
      Object.keys(jsonSchema).forEach(property => {
        let config = new UiKitControlConfig();
        config.name = property;
        config.type = this.uiKitControlTypeForSchema(property, jsonSchema[property]);
        config.value = data ? data[config.name] : null;
        config = this.getConfigFromOverrides(config, dataType);
        if (config)
          controlsConfig.push(config);
      });
    }
    return this.orderControlsForType(dataType, controlsConfig);
  }

  getConfigFromOverrides(config: UiKitControlConfig, dataType: string): UiKitControlConfig {
    let overridden = Object.assign(new UiKitControlConfig(), config);
    let hidden = false;
    if (this.schemasOverride) {
      let star = this.schemasOverride["*"];
      let typeOverride = this.schemasOverride[dataType];
      [star, typeOverride].forEach(e => {
        if (e) {
          if (config.name.toDashCase() == `${dataType}-id`) {
            hidden = e["hideSelfReference"] === true;
          }
          let overridenProp = e[config.name];
          if (overridenProp) {
            //changing the string into the enum value
            if(overridenProp["type"]){
              overridenProp["type"] = EnumExtensions.getValue(UiKitControlType,overridenProp["type"]);
            }
            overridden = Object.assign(overridden, overridenProp);
          }
        }
      });
    }
    return overridden;
  }

}
