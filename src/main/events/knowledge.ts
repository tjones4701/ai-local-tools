import { getRepository, saveEntity } from '../data/datasource';
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

async function getTestFileSource(collection: SourceCollection) {
  const latestSource: Source = (await (
    await getRepository(Source)
  ).findOne({
    where: { id: 53 }
  })) as any;
  if (latestSource.source_collection_id != collection.id) {
    latestSource.source_collection_id = collection.id;
    await saveEntity(latestSource);
    throw new Error('Source collection updated');
  }
  if (latestSource != null) {
    await latestSource.process();
    return latestSource;
  } else {
    throw new Error('No source found');
  }
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
