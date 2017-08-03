import { Injectable } from '@angular/core';

@Injectable()
export class DateService {

  private __today: Date;
  get today() {
    return this.__today;
  }
  constructor() {
    this.__today = new Date();
  }
}
