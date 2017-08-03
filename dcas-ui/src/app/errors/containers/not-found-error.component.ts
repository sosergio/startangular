import { Component } from '@angular/core';

@Component({
  selector: 'dcas-not-found-error',
  template: `
  <dcas-page-header></dcas-page-header>
  <main>
     <h2>Error: Not Found</h2>
     <p>The resource you were looking for appears to have been moved, deleted or does not exist.</p>
     <p>You could go back to <a (click)="goBack()">where you were</a> or head straight to the <a [routerLink]="['/']">homepage</a>.
  </main>
  `
})
export class NotFoundErrorComponent{
  goBack(){
    window.history.back();
  }
}
