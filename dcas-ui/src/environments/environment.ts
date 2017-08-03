import { LogLevel } from 'environments/environment.interface';
import { IEnvironment } from './environment.interface';
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment:IEnvironment = {
  appBaseUrl:"/",
  production: false,
  logLevel: LogLevel.LOG,
  //referenceDataApiBaseUrl:"http://localhost:15002/ref-data-service/v1/",
  bffApiUrl:"http://localhost:5000",
  jsonSchemaPath:"http://localhost:5000/json-schemas/reference-data",
  jsonSchemaOverridesPath:"./assets/contracts/ReferenceDataMaintenance-override.json",
  listPageSize:10
};
