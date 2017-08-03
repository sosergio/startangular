import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() { }

  set(key: string, value: any) {
    if (value) {
      var serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    }
    else {
      localStorage.removeItem(key);
    }

  }

  get(key: string): any {
    var json = localStorage.getItem(key);
    if (json) {
      try {
        return JSON.parse(json);
      }
      catch (error) {
        this.set(key, null);
      }
    }
    return null;
  }
}
