import { app } from 'electron';
import { EventHandler } from '../event';
import { promises as fs } from 'fs';
import * as path from 'path';
import { createEntity } from '../data/datasource';
import { Notification } from '../data/entities/notifications.entity';

export const dataEvents: Record<string, EventHandler> = {};

const getDataFilePath = (fileName: string) => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, `${fileName}.json`);
};

dataEvents.saveData = async (key: string, data: any) => {
  const filePath = getDataFilePath(key);
  console.log(filePath);
  await fs.writeFile(filePath, JSON.stringify(data));
  const notification = await createEntity(Notification, {
    title: 'Data Saved',
    message: `Data saved to ${filePath}`
  });

  console.log(notification);
};

export async function getData<T>(fileName: string, defaultValue: T): Promise<T> {
  const filePath = getDataFilePath(fileName);
  try {
    const fileData = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileData) ?? defaultValue;
  } catch (error) {
    return defaultValue;
  }
}
dataEvents.getData = async (fileName: string, defaultValue: any) => {
  return getData(fileName, defaultValue);
};
