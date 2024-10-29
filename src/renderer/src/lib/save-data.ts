import debounce from './debounce';
import { rpc } from './server';

function parseFileName(key: string): string {
  const sanitizedKey = key.replace(/[^a-zA-Z0-9_-]/g, '');
  return sanitizedKey;
}

async function originalSaveData<T>(key: string, value: T): Promise<boolean> {
  key = parseFileName(key);
  return await rpc.saveData(key, value);
}

async function getData<T>(key: string, defaultData: T | null = null): Promise<T | null> {
  key = parseFileName(key);
  return await rpc.getData<T>(key, defaultData);
}

async function deleteData(key: string): Promise<boolean> {
  key = parseFileName(key);
  return await rpc.saveData(key, undefined);
}

const saveData = debounce(originalSaveData, 300);
export { deleteData, getData, saveData };
