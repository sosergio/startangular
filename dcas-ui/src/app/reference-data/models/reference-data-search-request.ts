import { ReferenceDataStatus } from "app/reference-data/models/reference-data";

export class ReferenceDataSearchRequest {
  freeText: string;
  objectType: string;
  status: ReferenceDataStatus;
  offset: number;
  count: number;
  orderBy:string;
  ascendent:boolean;
  includeAllVersions:boolean;
}
