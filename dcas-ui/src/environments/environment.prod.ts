import { IEnvironment, LogLevel } from './environment.interface';

export const environment :IEnvironment= {
  appBaseUrl:"/",
  production: true,
  logLevel:LogLevel.ERROR,
  bffApiUrl:"http://localhost:5000",
  jsonSchemaPath:"http://localhost:5000/json-schemas/reference-data",
  jsonSchemaOverridesPath:"./assets/contracts/ReferenceDataMaintenance-override.json",
  listPageSize:10
};
