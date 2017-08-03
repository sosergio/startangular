import { UserContextService } from './../services/user-context.service';
import { AppConfigService } from './../services/app-config.service';
import { Observable } from 'rxjs/Rx';
import { Http, RequestOptionsArgs, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class DcasApiResource {

  protected url: string;
  protected headers: Map<string, string>;

  constructor(
    protected userContextService: UserContextService,
    protected http: Http) { }

  protected init(baseUrl: string): DcasApiResource {
    this.url = baseUrl;
    return this;
  }

  public toString() {
    return this.url;
  }

  many(ids: number[]): DcasApiResource {
    this.url += `/${ids.join(',')}`;
    return this;
  }

  one(id: number): DcasApiResource {
    this.url += `/${id}`;
    return this;
  }

  append(text: string): DcasApiResource {
    this.url += `/${text}`;
    return this;
  }

  addQuery(key: string, value: any) {
    if (value) {
      let prefix = this.url.indexOf('?') > -1 ? '&' : '?';
      let stringV = value.toString();
      if (value instanceof Array) {
        stringV = value.join(',');
      }
      this.url += `${prefix}${key}=${stringV}`;
    }
    return this;
  }

  withAuth(): DcasApiResource {
    if (!this.headers) {
      this.headers = new Map<string, string>();
    }
    let uc = this.userContextService.get();
    this.headers.set("X-Forwarded-cn", "User");
    this.headers.set("X-Forwarded-businessId", uc.businessId.toString());
    this.headers.set("X-Forwarded-roles", uc.roles.join(','));
    return this;
  }

  httpGet(options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .get(this.url, options);
  }

  private appendHeaders(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      const headerDict = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
      }

      options.headers = new Headers(headerDict);
    }
    // if (this.headers) {
    //   this.headers.forEach((value, key) => {
    //     options.headers.append(key, value);
    //   });
    // }
    return options;
  }

  /**
   * Performs a request with `post` http method.
   */
  httpPost(body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .post(this.url, body, options);
  }
  /**
   * Performs a request with `put` http method.
   */
  httpPut(body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .put(this.url, body, options);
  }
  /**
   * Performs a request with `delete` http method.
   */
  httpDelete(options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .delete(this.url, options);
  }
  /**
   * Performs a request with `patch` http method.
   */
  httpPatch(body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .patch(this.url, body, options);
  }
  /**
   * Performs a request with `head` http method.
   */
  httpHead(options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .head(this.url, options);
  }
  /**
   * Performs a request with `options` http method.
   */
  httpOptions(options?: RequestOptionsArgs): Observable<Response> {
    options = this.appendHeaders(options);
    return this.http
      .options(this.url, options);
  }
}
