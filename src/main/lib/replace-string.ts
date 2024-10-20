export function replaceString(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, 'g'), replace);
}
