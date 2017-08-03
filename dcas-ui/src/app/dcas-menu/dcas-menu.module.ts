import { CommonModule } from './../common/common.module';
import { DcasMenuComponent } from './containers/dcas-menu.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
@NgModule({
  declarations: [
    DcasMenuComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
  ],
  exports: [
    DcasMenuComponent
  ]
})
export class DcasMenuModule { }
