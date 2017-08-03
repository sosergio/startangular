import { ApiSearchResponse } from './../../common/models/api-response';
import { ReferenceDataApiResource } from './../resources/reference-data.resource';
import { UserContextService } from './../../common/services/user-context.service';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';
import { IReferenceDataService } from './../interfaces/reference-data-service.interface';
import { IReferenceData } from './../models/reference-data';
import { Http } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ReferenceDataService implements IReferenceDataService {
  create(data: IReferenceData): Observable<IReferenceData> {
    return this.referenceDataApiResource
      .referenceData(data.objectType)
      .withAuth()
      .httpPost(data)
      .map(res => {
        let dto = <IReferenceData>res.json();
        return dto;
      });
  }
  get(type: string, id: number): Observable<IReferenceData> {
    return this.referenceDataApiResource
      .referenceData(type)
      .one(id)
      .withAuth()
      .httpGet()
      .map(res => {
        let dto = <IReferenceData>res.json();
        return dto;
      });
  }
  update(data: IReferenceData): Observable<IReferenceData> {
    return this.referenceDataApiResource
      .referenceData(data.objectType)
      .one(data.id)
      .withAuth()
      .httpPut(data)
      .map(res => {
        let dto = <IReferenceData>res.json();
        return dto;
      });
  }
  delete(type: string, id: number, reason:string) {
    let body = {
      id:id,
      reason:reason
    };
    return this.referenceDataApiResource
      .referenceData(type)
      .delete()
      .withAuth()
      .httpPost(body)
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }
  submit(type: string, id: number) {
    return this.referenceDataApiResource
      .referenceData(type)
      .submitMany()
      .withAuth()
      .httpPost([id])
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }

  approve(type: string, id: number) {
    return this.referenceDataApiResource
      .referenceData(type)
      .approveMany()
      .withAuth()
      .httpPost([id])
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }
  reject(type: string, id: number, reason:string) {
    return this.referenceDataApiResource
      .referenceData(type)
      .rejectMany()
      .withAuth()
      .httpPost([id])
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }
  retract(type: string, id: number) {
    return this.referenceDataApiResource
      .referenceData(type)
      .retractMany()
      .withAuth()
      .httpPost([id])
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }
  withdraw(type: string, id: number, reason:string) {
    return this.referenceDataApiResource
      .referenceData(type)
      .withdrawMany()
      .withAuth()
      .httpPost([id])
      .map(res => {
        let dto = <IReferenceData>res.json();
        //return dto;
      });
  }


  search(request: ReferenceDataSearchRequest): Observable<ApiSearchResponse<IReferenceData[]>> {
    return this.referenceDataApiResource
      .referenceData(request.objectType)
      .search(request)
      .withAuth()
      .httpGet()
      .map(res => {
        let dto = <IReferenceData[]>res.json();
        return Object.assign(new ApiSearchResponse<IReferenceData[]>(),dto);
      })
  }


  constructor(private http: Http, private userContextService: UserContextService, private referenceDataApiResource: ReferenceDataApiResource) { }
}
