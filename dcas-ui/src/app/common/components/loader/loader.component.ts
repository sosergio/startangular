import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'dcas-loader',
  template: `
    <div class="dcas-loader" *ngIf="delayedDisplay">
      <div class="text"><ng-content></ng-content></div>
      <div class="spinner"></div>
    </div>`
})
export class LoaderComponent implements OnInit, OnDestroy {
  delayedDisplay: boolean;
  timeout : any;

  @Input()
  delay:number = 100;

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
  }

  ngOnInit(): void {
    var self = this;
    this.timeout = setTimeout(function () {
      self.delayedDisplay = true;
    }, this.delay);
  }


}
