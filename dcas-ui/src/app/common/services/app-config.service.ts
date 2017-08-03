import { environment } from './../../../environments/environment';
import { IEnvironment } from './../../../environments/environment.interface';
import { Injectable } from '@angular/core';


@Injectable()
export class AppConfigService {

    public environment:IEnvironment;

    constructor() {
        this.environment = environment;
    }
}
