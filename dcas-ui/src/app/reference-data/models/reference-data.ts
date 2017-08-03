export interface IReferenceData {
  id?:number;
  changeEffectiveDate?:string;
  objectType:string;
  approvalStatusId?:ReferenceDataStatus
}

export enum ReferenceDataStatus{
  draft = 1,
  awaitingApproval = 2,
  approved = 3
}
