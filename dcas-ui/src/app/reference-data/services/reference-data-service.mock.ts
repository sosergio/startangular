import { ApiSearchResponse } from './../../common/models/api-response';
import { ReferenceDataStatus } from 'app/reference-data/models/reference-data';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';
import { IReferenceDataService } from './../interfaces/reference-data-service.interface';
import { IReferenceData } from './../models/reference-data';
import { Http } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';


class GenericReferenceData implements IReferenceData {
  id: number;
  changeEffectiveDate: string;
  objectType: string;
  approvalStatusId: ReferenceDataStatus;
}

@Injectable()
export class ReferenceDataServiceMock implements IReferenceDataService {
    submit(type: string, id: number) {
      throw new Error('Method not implemented.');
    }
  retract(type: string, id: number) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: Http) { }
  private _staticData: Map<string, IReferenceData[]>;

  private loadStaticData(type: string): Observable<IReferenceData[]> {
    if (!this._staticData) {
      this._staticData = new Map<string, GenericReferenceData[]>();
    }
    let randomDelay = Math.floor((Math.random() * 2000) + 100);
    let collection = this._staticData.get(type);
    randomDelay= 0;
    if (type != "business" && type != "product" && !collection) {
      collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
        return {
          id: n,
          objectType: type,
          name: `${type} ${n}`,
          changeEffectiveDate: '2017-01-01T00:00:00Z',
          approvalStatusId: ReferenceDataStatus.approved
        }
      });
      this._staticData.set(type, collection);
    }

    if (!collection) {
      return this.http
        .get(`/src/assets/data/mock-${type}.json`)
        .map(res => {
          collection = res.json() || [];
          this._staticData.set(type, collection);
          return collection;
        }).delay(randomDelay);
    } else {
      return new Observable(observer => observer.next(collection)).delay(randomDelay);
    }
  }

  search(request: ReferenceDataSearchRequest): Observable<ApiSearchResponse<IReferenceData[]>> {
    return this.loadStaticData(request.objectType)
      .map(all => {
        let result = all;
        if (request.freeText) {
          result = all.filter(d => {
            for (let p in d) {
              if (d[p].toString().toLowerCase().indexOf(request.freeText.toLowerCase()) > -1) {
                return true;
              }
            }
          });
        }

        if (!request.includeAllVersions) {
          //result = result.filter(d => d.approvalStatusId == ReferenceDataStatus.approved);
          let objTypeCameCase = request.objectType.toCamelCase()+"Id";
          let grouped = result.groupBy(objTypeCameCase);
          let highestCeds = Object.keys(grouped).map(key => {
            let arr = <Array<IReferenceData>>grouped[key];
            let highestCed = arr.orderBy("changeEffectiveDate",false)[0];
            return highestCed;
          });
          result = highestCeds;

        } else if (request.status) {
          result = result.filter(d => d.approvalStatusId == request.status);
        }

        if(request.orderBy){
          result = result.orderBy(request.orderBy, request.ascendent);
        }

        let page = result ? result.slice(request.offset, request.count+request.offset) : null;

        let response = new ApiSearchResponse();
        response.data = page;
        response.currentPage = (request.offset/request.count)+1;
        response.totalCount = result.length;

        return response;
      })
  }

  create(data: IReferenceData): Observable<IReferenceData> {
    return this.loadStaticData(data.objectType).map(xs => {
      let collection = this._staticData.get(data.objectType);
      data.id = collection.length;
      collection.push(data);
      return data;
    });
  }

  get(type: string, id: number): Observable<IReferenceData> {
    return this.loadStaticData(type)
      .map(all => all.find(d => d.id == id));
  }

  update(data: IReferenceData): Observable<IReferenceData> {
    return this.loadStaticData(data.objectType).map(all => {
      let ix = all.indexOfItemWithAttr('id', data.id);
      if (ix > -1) {
        let collection = this._staticData.get(data.objectType);
        collection = collection.splice(ix, 1, data);
        this._staticData.set(data.objectType, collection);
        return data;
      }
      return null;
    });
  }

  delete(type: string, id: number, reason:string) {
    return this.loadStaticData(type).map(all => {
      let ix = all.indexOfItemWithAttr('id', id);
      if (ix > -1) {
        let collection = this._staticData.get(type);
        collection = collection.splice(ix, 1);
      }
    });
  }

  approve(type: string, id: number) {
    let self = this;
    this.get(type, id).map(d => {
      d.approvalStatusId = ReferenceDataStatus.approved;
      self.update(d);
    });
  }

  withdraw(type: string, id: number, reason:string) {
    let self = this;
    this.get(type, id).map(d => {
      d.approvalStatusId = ReferenceDataStatus.draft;
      self.update(d);
    });
  }

  reject(type: string, id: number, reason:string) {
    let self = this;
    this.get(type, id).map(d => {
      d.approvalStatusId = ReferenceDataStatus.draft;
      self.update(d);
    });
  }
}
