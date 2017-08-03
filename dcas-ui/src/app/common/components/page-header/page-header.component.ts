import { MenuItem } from './../../../dcas-menu/models/menu-item';
import { AppConfigService } from './../../services/app-config.service';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'dcas-page-header',
  templateUrl:'./page-header.component.html'
})
export class PageHeaderComponent {
  isMenuOpen: boolean;

  title: string;
  paths:MenuItem[];

  constructor(route: ActivatedRoute, appConfig:AppConfigService) {
    this.paths = new Array<MenuItem>();
    let rootItem = new MenuItem();
    rootItem.title = "DCAS";
    rootItem.url = appConfig.environment.appBaseUrl;
    this.paths.push(rootItem)

    this.getParentDescription(route)
      .subscribe(d => {
        if(d.title){
        this.paths.push(d);
        }
      });
  }

  getParentDescription(route: ActivatedRoute): Observable<any> {
    let observable = new Observable(observer => {
      if (route.parent)
        this.getParentDescription(route.parent).subscribe(d => {
          observer.next(d);
        });
      route.data
        .subscribe(d => {
          let title = d.title;
          route.url.subscribe(url => {
            if(url && url.length >0)
              observer.next(d ? {title:title, url:url[0].path} : '');
          })
        });
    });
    return observable;
  }
}
