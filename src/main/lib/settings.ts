import { getData } from '../events/data';

export async function getSettings<T>(code: string, key: string, defaultValue: T): Promise<T> {
  const data = await getData('SETTINGS_' + code, {});
  return data[key] ?? defaultValue;
}
