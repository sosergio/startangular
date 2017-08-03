import { LoggerService } from './logger.service';
import { LocalStorageService } from './local-storage.service';
import { UserContext } from './../models/user-context';
import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from  'rxjs/Observable';


@Injectable()
export class UserContextService {

  private USER_CONTEXT_STORAGE_KEY = "__user_context";

  public onChange$: EventEmitter<UserContext>;
  public onLogin$: EventEmitter<UserContext>;
  public onLogout$: EventEmitter<boolean>;

  private _userContext:UserContext;
  constructor(private localStorageProvider:LocalStorageService, private logger:LoggerService) {
    this.onChange$ = new EventEmitter<UserContext>();
    this.onLogin$ = new EventEmitter<UserContext>();
    this.onLogout$ = new EventEmitter();
    var stored = <UserContext>this.localStorageProvider.get(this.USER_CONTEXT_STORAGE_KEY) || new UserContext();
    this.update(stored);
  }

  get(){
    return this._userContext;
  }

  login(businessId:number, roles:string[]){
    this.logger.log("[UserContextService] login");
    let uc = this._userContext || new UserContext();
    uc.businessId = businessId;
    uc.roles = roles;
    this.save(uc);
    this.onLogin$.emit(this._userContext);
  }

  isLoggedIn(){
    return this._userContext.businessId != null && this._userContext.roles != null;
  }

  logout(){
    this.logger.log("[UserContextService] logout");
    this.save(null);
    this.onLogout$.emit(true);
  }

  update(value:UserContext){
    this.logger.log("[UserContextService] update");
    this.save(value);
    this.onChange$.emit(this._userContext);
  }

  private save(value:UserContext){
    this._userContext = value;
    let wr = Object.assign({}, this._userContext);
    this.localStorageProvider.set(this.USER_CONTEXT_STORAGE_KEY, wr);
  }
}
