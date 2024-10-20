import sqlite3 from 'sqlite3';
import { ISqlite, open } from 'sqlite';
import { getUserFilePath } from '../files';

const filePath = getUserFilePath('database.db');

export function getDatabaseConfiguration(options: Partial<ISqlite.Config> = {}) {
  return {
    filename: filePath,
    driver: sqlite3.cached.Database,
    ...options
  };
}

export async function openDatabase(options: Partial<ISqlite.Config> = {}) {
  const configuration = getDatabaseConfiguration(options);
  const db = await open(configuration);
  return {
    database: db,
    path: filePath
  };
}
