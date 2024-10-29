export function noEmptyString(str: any): string | null {
  if (typeof str?.trim !== 'function') {
    return null;
  }
  if (str?.trim() === '') {
    return null;
  } else {
    return str;
  }
}

export function isEmptyString(str: string): boolean {
  return !noEmptyString(str);
}
