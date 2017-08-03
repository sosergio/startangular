import { UiKitSelectOption } from './../components/ui-kit-select.component';
export enum UiKitControlType {
  string,
  password,
  date,
  boolean,
  select,
  number,
  hidden
}

export class UiKitControlConfig {
  type?: UiKitControlType;
  name?: string;
  css?: string;
  value?: any;
  disabled?: boolean;
  placeholder?: string;
  options?: UiKitSelectOption[];
  order?:number;

  /**
   * Converts the config into an object that can be passed to FormBuilder.control as the formState parameter.
   * It returns a {value:any, disabled:boolean} object
   */
  toFormState(): any {
    return {
      value: this.value,
      disabled: this.disabled
    }
  }
}
