import { app } from 'electron';
import * as path from 'path';

export function getUserFilePath(fileName: string) {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, fileName);
}
