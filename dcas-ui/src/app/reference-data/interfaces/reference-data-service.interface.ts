import { ApiSearchResponse } from './../../common/models/api-response';
import { IReferenceData } from './../models/reference-data';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';


export interface IReferenceDataService {
  search(request: ReferenceDataSearchRequest): Observable<ApiSearchResponse<IReferenceData[]>>;
  create(data: IReferenceData): Observable<IReferenceData>;
  get(type: string, id: number): Observable<IReferenceData>;
  update(data: IReferenceData): Observable<IReferenceData>;
  delete(type: string, id: number, reason:string);
  submit(type: string, id: number);
  approve(type: string, id: number);
  reject(type: string, id: number, reason:string);
  retract(type: string, id: number);
  withdraw(type: string, id: number, reason:string);
}
