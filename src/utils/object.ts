/**
 * @template T
 * @param {T} obj
 * @param {string} desc
 * @returns {any}
 */
export function objectAccessor<T>(obj: T, desc: string): any {
    const arr = desc ? desc.split(".") : [];
    let result: any = obj;
    while (arr.length && (result = result?.[arr.shift() as keyof T]));
    return result;
  }
  