import fs from 'fs';
import path from 'path';
import { getRepository } from '../data/datasource';
import { SourceCollection } from '../data/entities/source-collection.entity';
import { Source } from '../data/entities/source.entity';

async function getTestSourceCollection() {
  const repository = await getRepository(SourceCollection);
  const collections = await repository.find();
  const collectionName = 'test';
  let existingCollection = collections.find((c) => c.name === collectionName);
  if (existingCollection == null) {
    existingCollection = new SourceCollection();
    existingCollection.name = collectionName;
    existingCollection.description = 'Test collection';
    await repository.save(existingCollection);
  }
  return existingCollection as SourceCollection;
}

const basePath = 'C:/temp/base';

async function createTestFiles(): Promise<string> {
  let randomFileName = Math.random().toString(36).substring(7);
  const newFolderPath = path.join('C:/temp', randomFileName);
  fs.mkdirSync(newFolderPath);

  const files = fs.readdirSync(basePath);
  for (const file of files) {
    const sourcePath = path.join(basePath, file);
    const destPath = path.join(newFolderPath, file);
    fs.copyFileSync(sourcePath, destPath);
  }
  return newFolderPath;
}

async function getTestFileSource(collection: SourceCollection) {
  const testFilePath = await createTestFiles();
  const source = new Source<{ filePath: string }>();
  source.metadata = { filePath: testFilePath };
  source.source_type = 'FILE';
  source.source_collection = collection;
  source.source_collection_id = collection.id;
  await source.process();
}

async function knowledgeTest() {
  try {
    const existingCollection = await getTestSourceCollection();
    await getTestFileSource(existingCollection);
    console.log(existingCollection.name);
  } catch (e) {
    console.error(e);
  }
}

export const knowledgeEvents = {
  'knowledge.test': knowledgeTest
};
