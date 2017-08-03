export interface IEnvironment{
  appBaseUrl:string,
  production: boolean;
  logLevel: LogLevel;
  bffApiUrl:string;
  jsonSchemaPath:string;
  listPageSize:number;
  jsonSchemaOverridesPath:string;
}

export enum LogLevel { OFF = 0, ERROR = 1, WARN = 2, INFO = 3, DEBUG = 4, LOG = 5 }
