import { app } from 'electron';
import { EventHandler } from '../event';
import { promises as fs } from 'fs';
import * as path from 'path';

export const dataEvents: Record<string, EventHandler> = {};

export const getDataFilePath = (fileName: string) => {
  const userDataPath = app.getPath('userData');
  if (fileName.startsWith(userDataPath)) {
    return fileName;
  }
  return path.join(userDataPath, `${fileName}`);
};

export function getFiles(folderPath: string) {
  return fs.readdir(getDataFilePath(folderPath));
}

async function makeSureDirectoryExists(filePath: string) {
  if (path.extname(filePath)) {
    filePath = path.dirname(filePath);
  }
  await fs.mkdir(filePath, { recursive: true });
}

export async function saveData(key: string, data: any) {
  let filePath = getDataFilePath(key);
  let dataString: string = data;
  // If data is an object
  if (typeof data === 'object') {
    let fileExtension = path.extname(filePath);
    if (fileExtension == '') {
      filePath = `${filePath}.json`;
    }
    dataString = JSON.stringify(data);
  }
  await makeSureDirectoryExists(filePath);
  await fs.writeFile(filePath, data);
  return filePath;
}

export async function getData<T>(fileName: string, defaultValue: T): Promise<T> {
  const filePath = getDataFilePath(fileName);
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    if (fileName.endsWith('.json')) {
      return JSON.parse(fileData) ?? defaultValue;
    } else {
      return (fileData as unknown as T) ?? defaultValue;
    }
  } catch (error) {
    return defaultValue;
  }
}

dataEvents.getData = getData;
dataEvents.saveData = saveData;
