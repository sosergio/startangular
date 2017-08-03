import { LogLevel } from 'environments/environment.interface';
import { environment } from './../environments/environment';
import { DcasErrorHandler } from './errors/services/dcas-error-handler.service';
import { NotFoundErrorComponent } from './errors/containers/not-found-error.component';
import { ErrorsModule } from './errors/errors.module';
import { ReferenceDataServiceMock } from './reference-data/services/reference-data-service.mock';
import { ReferenceDataService } from './reference-data/services/reference-data.service';
import { DcasMenuModule } from './dcas-menu/dcas-menu.module';
import { CommonModule } from './common/common.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ReferenceDataModule } from "app/reference-data/reference-data.module";

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'reference-data',
    pathMatch: 'full',
  },
  { path: '**', component: NotFoundErrorComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false }  // <-- debugging purposes only)
    ),
    //dcas modules
    ErrorsModule,
    CommonModule,
    DcasMenuModule,
    ReferenceDataModule

  ],
  providers:[
    // uncomment this to inject a mock version of the services
    //{provide: ReferenceDataService, useClass: ReferenceDataServiceMock},
    {provide: ErrorHandler, useClass: DcasErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
