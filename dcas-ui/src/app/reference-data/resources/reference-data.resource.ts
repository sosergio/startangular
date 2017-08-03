import { ReferenceDataStatus } from 'app/reference-data/models/reference-data';
import { ReferenceDataSearchRequest } from './../models/reference-data-search-request';
import { UserContextService } from './../../common/services/user-context.service';
import { AppConfigService } from './../../common/services/app-config.service';
import { DcasApiResource } from './../../common/services/dcas-api.resource';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ReferenceDataApiResource extends DcasApiResource {

  constructor(
    protected appConfig: AppConfigService,
    protected userContextService: UserContextService,
    protected http: Http) {
    super(userContextService, http);
  }

  referenceData(type:string): ReferenceDataApiResource {
    return <ReferenceDataApiResource>this.init(this.appConfig.environment.bffApiUrl)
      .append('reference-data')
      .append(type);
  }

  search(request:ReferenceDataSearchRequest){
      this.addQuery('freeText',request.freeText)
          .addQuery('asc', request.ascendent)
          .addQuery('count',request.count)
          .addQuery('offset',request.offset)
          .addQuery('order',request.orderBy);

      if(request.includeAllVersions){
          this.addQuery('allVersions', true);
          this.addQuery('status',request.status);
      }
      return this;
  }
  delete():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('deletions');
  }

  submitMany():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('submissions');
  }
  approveMany():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('approvals');
  }
  rejectMany():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('rejections');
  }
  retractMany():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('retractions');
  }
  withdrawMany():ReferenceDataApiResource{
    return <ReferenceDataApiResource>this.append('withdrawals');
  }
}
