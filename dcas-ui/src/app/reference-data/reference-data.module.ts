import { ReferenceDataActionHandlerComponent } from './containers/reference-data-actions-handler.component';
import { ReferenceDataResolver } from './resolvers/reference-data.resolver';
import { ReferenceDataJsonSchemasService } from './services/reference-data-json-schemas.service';
import { ReferenceDataComponent } from './reference-data.component';
import { UiKitDatePickerComponent } from './../ui-kit/components/ui-kit-date-picker.component';
import { ReferenceDataApiResource } from './resources/reference-data.resource';
import { ReferenceDataDetailResolver } from './resolvers/reference-data-detail.resolver';
import { ReferenceDataService } from './services/reference-data.service';
import { ReferenceDataListComponent } from './components/reference-data-list.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { UiKitModule } from './../ui-kit/ui-kit.module';
import { CommonModule } from './../common/common.module';
import { ReferenceDataSearchComponent } from './containers/reference-data-search.component';
import { NgModule, Component, forwardRef } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceDataDetailComponent } from "app/reference-data/containers/reference-data-detail.component";
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

const routes: Routes = [
  {
    path: 'reference-data',
    component: ReferenceDataComponent,
    resolve: {
      resolveResult: ReferenceDataResolver
    },
    data: {
      title: "Reference Data"
    },
    children: [
      {
        path: '',
        component: ReferenceDataSearchComponent,
        data: {
          title: "Search"
        }
      },
      {
        path: 'new',
        component: ReferenceDataDetailComponent,
        data: {
          title: "Add New"
        }
      },
      {
        path: ':type/:id',
        resolve: {
          resolveResult: ReferenceDataDetailResolver
        },
        children: [
          {
            path:'',
            component: ReferenceDataDetailComponent,
            data: {
              title: "Detail"
            },
          },
          {
            path: 'copy',
            component: ReferenceDataDetailComponent,
            data: {
              title: "Copy",
              copy:true
            }
          }
        ]
      }
    ]
  }];

@NgModule({
  declarations: [
    ReferenceDataSearchComponent,
    ReferenceDataDetailComponent,
    ReferenceDataListComponent,
    ReferenceDataComponent,
    ReferenceDataActionHandlerComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forChild(routes),
    CommonModule,
    UiKitModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [

  ],
  providers: [
    ReferenceDataService,
    ReferenceDataDetailResolver,
    ReferenceDataApiResource,
    ReferenceDataResolver,
    ReferenceDataJsonSchemasService
  ],
  entryComponents: [
  ]
})
export class ReferenceDataModule { }
