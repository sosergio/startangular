import { LocalizeService } from './../services/localize.service';
import { Directive, Input, ElementRef, OnInit, Renderer, OnChanges } from '@angular/core';

@Directive({
  selector: '[localize]'
})
export class LocalizeDirective {

  key: string;

  @Input() set localize(key: string) {
    this.key = key;
    this.load();
  }

  constructor(private el: ElementRef, private localizeService: LocalizeService, private _renderer: Renderer) {
    this.localizeService.onDataLoaded$.subscribe(() => {
      this.load();
    });
  }

  load() {
    let result = this.localizeService.localize(this.key);
    if (result) {
      this._renderer.setElementProperty(this.el.nativeElement, 'innerHTML', result);
    }
  }
}
