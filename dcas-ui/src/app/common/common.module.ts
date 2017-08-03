import { DialogComponent } from './components/dialog/dialog.component';
import { DateService } from './services/date-service';
import { PaginatorComponent } from './components/paginator/paginator.components';
import { UiKitModule } from './../ui-kit/ui-kit.module';
import { DynamicControlComponent } from './components/dynamic-control/dynamic-control.component';
import { DcasApiResource } from './services/dcas-api.resource';
import { NotificationService } from './services/notification-service';
import { LoaderComponent } from './components/loader/loader.component';
import { LocalizeDirective } from './directives/localize.directive';
import { LocalizeService } from './services/localize.service';
import { ShellNavToggleDirective } from './directives/shell-nav-toggle.directive';
import { LoggerService } from './services/logger.service';
import { AppConfigService } from './services/app-config.service';
import { UserContextService } from './services/user-context.service';
import { LocalStorageService } from './services/local-storage.service';
import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NotificationSnackBarComponent } from "./components/notification-snack-bar/notification-snack-bar.component";

//importing common classes
import "./classes/array-extensions";
import "./classes/enum-extensions";
import "./classes/string-extensions";
import { DialogsService } from "app/common/services/dialogs.service";

let elements = [
    PageHeaderComponent,
    LocalizeDirective,
    ShellNavToggleDirective,
    LoaderComponent,
    NotificationSnackBarComponent,
    DynamicControlComponent,
    PaginatorComponent,

    ];
let entryComponents=[
  DialogComponent
];

@NgModule({
  imports:[
    BrowserModule,
    RouterModule,
    UiKitModule
  ],
  declarations: [
    elements,
    entryComponents
  ],
  exports:[
    elements,
  ],
  providers: [
    LocalStorageService,
    UserContextService,
    AppConfigService,
    LoggerService,
    LocalizeService,
    NotificationService,
    DcasApiResource,
    DateService,
    DialogsService
  ],
  entryComponents: entryComponents

})
export class CommonModule { }
