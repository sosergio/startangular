import { Component, Output, Input, EventEmitter, OnChanges } from '@angular/core';

@Component({
  selector: 'dcas-paginator',
  template: `
    <div class="dcas-paginator" [ngClass]="{'hidden':itemsCount==0}">
      <span>{{itemsCount}} Item{{itemsCount>1?'s':''}}</span>
      <a (click)="onPreviousClick()" [attr.disabled]="!canGoBack()" class="previous" [ngClass]="{'disabled':!canGoBack()}"><i class="material-icons">chevron_left</i></a>
      <a *ngFor="let page of visiblePages" (click)="onPageClick(page)" class="page" [ngClass]="{'active':page==currentPage}">{{page}}</a>
      <a (click)="onNextClick()" [attr.disabled]="!canGoForward()" class="next" [ngClass]="{'disabled':!canGoForward()}"><i class="material-icons">chevron_right</i></a>
      <span>{{totalPages}} Page{{totalPages>1?'s':''}}</span>
    </div>
  `
})
export class PaginatorComponent implements OnChanges {
  @Input()
  itemsCount: number;

  @Input()
  pageSize: number;

  @Output()
  onPageChanged: EventEmitter<number> = new EventEmitter<number>();

  currentPage: number = 1;

  totalPages: number;
  pages: number[];
  visiblePages : number[];

  //the maximum number of pages to display
  maxNumOfPagesToDisplay:number = 5;

  ngOnChanges(changes): void {
    if(changes.itemsCount){
      this.itemsCount = changes.itemsCount.currentValue ? changes.itemsCount.currentValue : 0;
      this.setupPaginator();
    }
  }

  setupPaginator(){
    this.totalPages = this.itemsCount ? Math.ceil(this.itemsCount / this.pageSize) : 0;
    this.pages = this.totalPages > 0 ? new Array(this.totalPages).fill(1).map((x, i) => i + 1) : [];
    this.currentPage = 1;
    this.updateDisplayedPages();
  }

  onPreviousClick() {
    if (this.canGoBack()) {
      this.onPageClick(--this.currentPage);
    }
  }
  onNextClick() {
    if (this.canGoForward()) {
      this.onPageClick(++this.currentPage);
    }
  }

  updateDisplayedPages(){
    if(this.pages && this.pages.length > this.maxNumOfPagesToDisplay){
      this.visiblePages = [];
      var cp = this.currentPage;
      var max = Math.min(this.maxNumOfPagesToDisplay, this.pages.length);
      var start = Math.max(cp - Math.floor(max/2), 1);
      var end = Math.min(cp + Math.floor(max/2), this.pages.length);
      if(end-start<max-1){
        if(cp<this.pages.length/2) end = max;
        else start = this.pages.length+1-max;
      }
      for(var i = start; i<=end; i++){
      this.visiblePages.push(i);
      }
    }
    else this.visiblePages = this.pages.slice(0);
  }

  onPageClick(num){
    this.currentPage = num;
    this.updateDisplayedPages();
    this.onPageChanged.emit(this.currentPage);
  }

  canGoBack() {
    return this.currentPage > 1;
  }

  canGoForward() {
    return this.currentPage < this.totalPages;
  }
}
