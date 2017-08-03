import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { NotFoundError, ApplicationError } from './../../common/models/errors';
import { Router } from '@angular/router';
import { Injectable, ErrorHandler, Injector } from "@angular/core";

@Injectable()
export class DcasErrorsService  {

  lastError: Subject<Error> = new BehaviorSubject<Error>(null);
  constructor() {}
}
