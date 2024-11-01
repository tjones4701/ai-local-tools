import { app } from 'electron';
import { EventHandler } from '../event';
import { promises as fs } from 'fs';
import * as path from 'path';
import { getRepository } from '../data/datasource';
import { SourceCollection } from '../data/entities/source-collection.entity';

export const dataEvents: Record<string, EventHandler> = {};

export const getDataFilePath = (fileName: string) => {
  const userDataPath = app.getPath('userData');
  if (fileName.startsWith(userDataPath)) {
    return fileName;
  }
  return path.join(userDataPath, `${fileName}`);
};

export async function getFiles(folderPath: string) {
  try {
    const filePath = getDataFilePath(folderPath);
    return await fs.readdir(filePath);
  } catch (e) {
    return [];
  }
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
  await fs.writeFile(filePath, dataString);
  return filePath;
}

export async function getData<T>(fileName: string, defaultValue: T): Promise<T> {
  let filePath = getDataFilePath(fileName);
  let fileExtension = path.extname(filePath);
  if (fileExtension == '') {
    filePath = `${filePath}.json`;
  }
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    if (filePath.endsWith('.json')) {
      return JSON.parse(fileData) ?? defaultValue;
    } else {
      return (fileData as unknown as T) ?? defaultValue;
    }
  } catch (error) {
    console.warn(error);
    return defaultValue;
  }
}

export async function getSourceCollections() {
  const repository = await getRepository(SourceCollection);
  return repository.find();
}

dataEvents.getData = getData;
dataEvents.saveData = saveData;
dataEvents.getSourceCollections = getSourceCollections;
