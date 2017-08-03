import { NotFoundError } from './../../common/models/errors';
import { Observable } from 'rxjs/Observable';
import { ReferenceDataJsonSchemasService } from './../services/reference-data-json-schemas.service';
import { AppConfigService } from './../../common/services/app-config.service';
import { Http } from '@angular/http';
import { ResolveResult } from './../../common/models/resolve-result';
import { Injectable } from '@angular/core';
import { Resolve } from "@angular/router";

@Injectable()
export class ReferenceDataResolver implements Resolve<ResolveResult<any>> {

  constructor(private appConfig: AppConfigService, private http: Http, private referenceDataJsonSchemasService: ReferenceDataJsonSchemasService) { }

  resolve(): Observable<ResolveResult<any>> {
    let result = new ResolveResult<any>();

    let refDataSchema = this.http.get(this.appConfig.environment.jsonSchemaPath).map(data => data.json())
    let refDataSchemaOverride = this.http.get(this.appConfig.environment.jsonSchemaOverridesPath).map(data => data.json())

    return Observable.forkJoin([refDataSchema, refDataSchemaOverride])
      .first()
      .map(forked => {
        let schema = forked[0];
        let override = forked[1];
        if (!schema) {
          throw new NotFoundError();
        }
        this.referenceDataJsonSchemasService.load(schema, override);
        result.data = forked;
        return result;
    }).catch((err, caught) => {
      result.error = err;
      return Observable.of(result);
    });
  }
}
