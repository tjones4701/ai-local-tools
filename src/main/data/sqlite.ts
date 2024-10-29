import { Database, ISqlite, open } from 'sqlite';
import * as sqliteVec from 'sqlite-vec';
import sqlite3 from 'sqlite3';
import { getUserFilePath } from '../files';

const filePath = getUserFilePath('database.db');
console.log('Database path:', filePath);

export async function loadExtensions(db: Database) {
  await sqliteVec.load(db);
}

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
  await loadExtensions(db);
  return {
    database: db,
    path: filePath
  };
}
