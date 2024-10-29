import { isArray } from './is-array';

export function forceArray(item) {
  if (!isArray(item)) {
    return [item];
  }
  return item;
}
