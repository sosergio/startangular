import { NotFoundError } from './../../common/models/errors';
import { LoggerService } from './../../common/services/logger.service';
import { ResolveResult } from './../../common/models/resolve-result';
import { ReferenceDataService } from './../services/reference-data.service';
import { IReferenceData } from './../models/reference-data';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

@Injectable()
export class ReferenceDataDetailResolver implements Resolve<ResolveResult<IReferenceData>> {

  constructor(private router:Router, private referenceDataService: ReferenceDataService, private logger:LoggerService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ResolveResult<IReferenceData>> {
    let self = this;
    let id = +route.paramMap.get('id');
    let type = route.paramMap.get('type');
    let result = new ResolveResult<IReferenceData>();
    return this.referenceDataService.get(type, id)
      .map(data => {
        if(!data){
          throw new NotFoundError();
        }
        result.data = data;
        return result;
      })
      .first()
      .catch((err,caught) => {
        result.error = err;
        return Observable.of(result);
      });
  }
}
