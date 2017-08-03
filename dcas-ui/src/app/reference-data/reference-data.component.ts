import { LoggerService } from './../common/services/logger.service';
import { ResolveResult } from './../common/models/resolve-result';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'dcas-reference-data',
  template: `<router-outlet></router-outlet>`
})
export class ReferenceDataComponent {
  constructor(private route: ActivatedRoute, private logger:LoggerService) {}

  ngOnInit() {
    this.logger.log("Data passed to ReferenceDataComponent:", this.route.snapshot.data);
    let resolveResult = <ResolveResult<any>>this.route.snapshot.data.resolveResult;
    if (resolveResult && resolveResult.error) {
      throw resolveResult.error;
    }
  }
}
