import { quickHash } from '@renderer/lib/quickhash';

export function uniqueArray<T = unknown>(arr: T[], key: any = null): T[] {
  if (arr == null) {
    return [];
  }
  const unique = {};
  for (const i in arr) {
    const item = arr[i];
    let itemKey: string | null = null;
    if (key != null) {
      itemKey = item?.[key];
    } else {
      itemKey = 's' + quickHash(item);
    }
    if (itemKey == null) {
      continue;
    }
    unique[itemKey] = item;
  }

  return Object.values(unique) as T[];
}
