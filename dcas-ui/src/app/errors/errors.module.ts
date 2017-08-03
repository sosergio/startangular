import { ApplicationErrorComponent } from './containers/application-error.component';
import { DcasErrorHandler } from './services/dcas-error-handler.service';
import { ErrorHandler } from '@angular/core';
import { NotFoundErrorComponent } from './containers/not-found-error.component';
import { BrowserModule } from '@angular/platform-browser';
import { UiKitModule } from './../ui-kit/ui-kit.module';
import { CommonModule } from './../common/common.module';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DcasErrorsService } from "app/errors/services/dcas-errors.service";

const routes: Routes = [
  {
    path: 'errors',
    children: [
      {
        path: 'not-found',
        component: NotFoundErrorComponent,
        data:{
          title:'Error'
        }
      },
      {
        path: 'application',
        component: ApplicationErrorComponent,
        data:{
          title:'Error'
        }
      }
    ]
  }];

@NgModule({
  declarations: [
    NotFoundErrorComponent,
    ApplicationErrorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forChild(routes),
    CommonModule,
    UiKitModule,
  ],
  providers: [
    DcasErrorsService
  ],

})
export class ErrorsModule { }
