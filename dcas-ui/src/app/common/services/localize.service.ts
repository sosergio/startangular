import { LoggerService } from './logger.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class LocalizeService {

  private onDataLoaded: Subject<any> = new BehaviorSubject<any>(null);
  onDataLoaded$ = this.onDataLoaded.asObservable();

  constructor(private logger:LoggerService){}

  dictionary;
  load(dictionary){
    this.dictionary = dictionary;
    this.onDataLoaded.next(dictionary);
  }

  /**
  * Tells if the key is present in the current translation dictionary
  * @param String the key to search
  *
  * @return wether the key is present or not
  */
  hasKey(key:string):boolean{
    if(!key)return false;
    let result = this.getProperty(key, this.dictionary || {});
    return result ? true : false;
  }

  /**
  * Returns localization's dictionary value for the given key,or a human readable version of the key if not found.
  * The dictionary allows for dot-notations retrievals.
  *
  * @param String nested in a dot-notation style parameter reference (ie "urls.small")
  * @return Object the value for the key
  */
  localize(key: string): any {
    if(!key)return null;
    let result = this.getProperty(key, this.dictionary || {});
    if (!result) {
      result = key.toHumanReadable();
    };
    return result;
  }

  /**
  * A function to take a string written in dot notation style, and use it to
  * find a nested object property inside of an object.
  *
  * @param String nested A dot notation style parameter reference (ie "urls.small")
  * @param Object object (optional) The object to search
  *
  * @return the value of the property in question
  */
  private getProperty(propertyName, object) {
    if(!propertyName || !propertyName.split) return null;
    var parts = propertyName.split("."),
      length = parts.length,
      i,
      property = object || this;

    for (i = 0; i < length; i++) {
      property = property[parts[i]];
      if(!property) return null;
    }

    return property;
  }
}
