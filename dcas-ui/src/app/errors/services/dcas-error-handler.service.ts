import { LoggerService } from './../../common/services/logger.service';
import { AppConfigService } from './../../common/services/app-config.service';
import { NotFoundError, ApplicationError } from './../../common/models/errors';
import { Router } from '@angular/router';
import { DcasErrorsService } from './dcas-errors.service'
import { Injectable, ErrorHandler, Injector } from "@angular/core";

@Injectable()
export class DcasErrorHandler implements ErrorHandler {

  constructor(private injector: Injector) { }

  handleError(error) {
    let router = this.injector.get(Router);
    let errorsService = this.injector.get(DcasErrorsService);
    let appConfigService = this.injector.get(AppConfigService);
    let loggerService = this.injector.get(LoggerService);

    errorsService.lastError.next(error);
    loggerService.error(error);
    if (error.name == NotFoundError.name) {
      router.navigate(['/errors', 'not-found']);
    }
    else if (appConfigService.environment.production) {
      if (error.name == ApplicationError.name) {
        if (error.unrecoverable) {
          router.navigate(['/errors', 'application']);
        }
      }
      else
        router.navigate(['/errors', 'application']);
    }
  }
}
