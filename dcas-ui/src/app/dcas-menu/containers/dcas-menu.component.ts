import { Component } from '@angular/core';

@Component({
  selector: 'dcas-menu',
  template: `
  <div class="dcas-menu">
    <div class="logo"><img src="assets/rdg-logo-small-white.png" /></div>
    <div class="dcas-menu-item">Mike Forest<span class="sub">mike.forest@gmail.com</span></div>
    <a class="dcas-menu-item" routerLinkActive="active" dcas-shell-nav-toggle [routerLink]="['reference-data']"><span class="material-icons">cloud</span>Reference Data</a>
    <a class="dcas-menu-item" routerLink="/exit"><span class="material-icons">exit_to_app</span>Exit</a>
  </div>
  `
})
export class DcasMenuComponent {

}
