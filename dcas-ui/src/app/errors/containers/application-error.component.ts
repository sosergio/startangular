import { AppConfigService } from './../../common/services/app-config.service';
import { DcasErrorsService } from './../services/dcas-errors.service';
import { Component } from '@angular/core';

@Component({
  selector: 'dcas-application-error',
  template: `
  <dcas-page-header></dcas-page-header>
  <main>
     <h2>Application Error</h2>
     <p>An error occurred processing your request.</p>
     <p>You could go back to <a (click)="goBack()">where you were</a> or head straight to the <a [routerLink]="['/']">homepage</a>.
     <div *ngIf="error">
      <br/>
      <a (click)="isErrorDetailVisible =!isErrorDetailVisible">{{isErrorDetailVisible?'Hide':'Show'}} Error's Details</a>
      <br/><br/>
      <pre *ngIf="isErrorDetailVisible">{{error?.name}}<br>{{error?.message}}</pre>
     </div>
  </main>
  `
})
export class ApplicationErrorComponent{
  error:Error;
  isErrorDetailVisible:boolean;
  constructor(private errorService:DcasErrorsService, private appConfig:AppConfigService){
    try{
    this.errorService.lastError.subscribe(err => this.error = err);
    this.isErrorDetailVisible = !this.appConfig.environment.production;
    }catch(err){
      console.log("Error loading the error page");
    }
  }
  goBack(){
    window.history.back();
  }
}
