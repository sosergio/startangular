export class EnumExtensions {
  public static getValue(enumeratorType: any, enumeratorValue: any) {
    if (enumeratorType && enumeratorValue && typeof enumeratorValue !== 'number') {
      return enumeratorType[enumeratorValue];
    } else return enumeratorValue;
  }
  public static getString(enumeratorType: any, enumeratorValue: any) {
    if (enumeratorType && enumeratorValue && typeof enumeratorValue === 'number') {
      return enumeratorType[enumeratorValue];
    } else return enumeratorValue;
  }
  /**
   * Gets all the names of the enumerator, as strings
   * @param enumerator the type of the enumerator
   */
  public static getAllNames(enumerator: any): string[] {
    let result = [];
    for (let n in enumerator) {
      if (typeof enumerator[n] === 'number') {
        result.push(n)
      }
    }
    return result;
  }
  /**
   * Gets all the keys of the enumerator, as numbers
   * @param enumerator the type of the enumerator
   */
  public static getAllKeys(enumerator: any): number[] {
    let result = [];
    for (let n in enumerator) {
      if (typeof enumerator[n] === 'string') {
        result.push(Number(n))
      }
    }
    return result;
  }

  /**
  * Gets all the keys of the enumerator, as numbers
  * @param enumerator the type of the enumerator
  */
  public static convertToArray(enumerator: any): any[] {
    let result = [];
    for (let n in enumerator) {
      if (typeof enumerator[n] === 'string') {
        result.push({ key: Number(n), value: enumerator[n] });
      }
    }
    return result;
  }
}
