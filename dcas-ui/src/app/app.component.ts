import { AppConfigService } from './common/services/app-config.service';
import { NotificationService, NotificationType, Notification } from './common/services/notification-service';
import { ApplicationError } from './common/models/errors';
import { DcasErrorsService } from 'app/errors/services/dcas-errors.service';
import { LocalizeService } from './common/services/localize.service';
import { Http } from '@angular/http';
import { UserContext } from './common/models/user-context';
import { UserContextService } from './common/services/user-context.service';
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { MdSnackBar, MdSnackBarConfig } from "@angular/material";

@Component({
  selector: 'app-root',
  template: `
  <div id="shell">
    <div id="shell-nav" [ngClass]="{'visible':isMenuOpen}">
      <dcas-menu></dcas-menu>
    </div>
    <div id="shell-content">
      <router-outlet></router-outlet>
    </div>
    <div id="shell-shader" [ngClass]="{'visible':isMenuOpen}" dcas-shell-nav-toggle></div>
  </div>
  <dcas-notification-snack-bar></dcas-notification-snack-bar>
  `
})
export class AppComponent {
  isMenuOpen: boolean;

  constructor(
    private http: Http,
    private localizeService: LocalizeService,
    private userContextService: UserContextService,
    private router: Router,
    private errorService: DcasErrorsService,
    private notificationService: NotificationService,
    private appConfig: AppConfigService) {
    this.isMenuOpen = this.userContextService.get().isMenuOpen;

    this.userContextService.onChange$.subscribe(ctx => {
      this.isMenuOpen = (<UserContext>ctx).isMenuOpen;
    });

    this.userContextService.login(999, ['role1']);

    //loading the translations keys based on the language
    this.http.get('assets/lang/en.json')
      .subscribe(data => {
        this.localizeService.load(data.json());
      });

    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.notificationService.info("Loading...", true);
        }
        else if (event instanceof NavigationEnd) {
          this.notificationService.dismiss();
        }
      });

    this.errorService.lastError
      .filter(err => err != null)
      .subscribe(err => this.notificationService.error(err.message));
  }
}
