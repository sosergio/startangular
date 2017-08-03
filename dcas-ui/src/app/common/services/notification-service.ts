import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { AppConfigService } from './app-config.service';
import { Injectable } from '@angular/core';

export enum NotificationType {
  info,
  success,
  error
}

export class Notification {
  text: string;
  type: NotificationType;
  sticky: boolean;
  constructor(text: string, type: NotificationType) {
    this.text = text;
    this.type = type;
  }
}

@Injectable()
export class NotificationService {
  notification: Subject<Notification> = new BehaviorSubject<Notification>(null);
  constructor(private appConfig: AppConfigService) { }

  success(message: string) {
    this.notification.next(new Notification(message, NotificationType.success));
  }
  error(message: string) {
    this.notification.next(new Notification(message, NotificationType.error));
  }
  info(message: string, sticky?: boolean) {
    let n = new Notification(message, NotificationType.info);
    n.sticky = sticky;
    this.notification.next(n);
  }
  dismiss(){
    this.notification.next(null);
  }
}
