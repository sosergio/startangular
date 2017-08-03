import { ReferenceDataStatus } from 'app/reference-data/models/reference-data';
import { EnumExtensions } from './../../common/classes/enum-extensions';
import { IReferenceData } from './reference-data';

export enum ReferenceDataActionType {
  view = 1,
  amend = 2,
  copy = 3,
  delete = 4,
  approve = 5,
  withdraw = 6,
  submit = 7,
  save = 8,
  reject = 9,
  retract = 10
}

export class ReferenceDataAction {
  type: ReferenceDataActionType;
  data: IReferenceData;
  disabled:boolean;


  constructor(type: ReferenceDataActionType, data: IReferenceData) {
    this.type = type;
    this.data = data;
    this.disabled = false;
  }


  /**
  * Gets all the actions enabled or disabled for the passed item
  * @param item is the reference data item to perform actions on
  */
  public static getActionsForItem(item: IReferenceData, today:Date): ReferenceDataAction[] {

    return EnumExtensions.getAllNames(ReferenceDataActionType).map(t => {
      let __type = ReferenceDataActionType[t];
      let action = new ReferenceDataAction(__type, item);
      let enabled = [];
      if(item.approvalStatusId === ReferenceDataStatus.draft){
        enabled = [
          ReferenceDataActionType.view,
          ReferenceDataActionType.delete,
          ReferenceDataActionType.submit,
          ReferenceDataActionType.save];
      }
      else if(item.approvalStatusId === ReferenceDataStatus.awaitingApproval){
        enabled = [
          ReferenceDataActionType.view,
          ReferenceDataActionType.approve,
          ReferenceDataActionType.reject,
          ReferenceDataActionType.retract];
      }
      else if(item.approvalStatusId === ReferenceDataStatus.approved && new Date(item.changeEffectiveDate) > today){
        enabled = [
          ReferenceDataActionType.view,
          ReferenceDataActionType.amend,
          ReferenceDataActionType.withdraw];
      }
      else{
        enabled = [
          ReferenceDataActionType.view,
          ReferenceDataActionType.amend,
          ReferenceDataActionType.copy];
      }
      action.disabled = enabled.indexOf(__type) === -1;
      return action;
    });
  }
}
