import { find, getEntity, getRepository, saveEntity, saveObject } from '../data/datasource';
import { SourceCollection } from '../data/entities/source-collection.entity';
import { SourcePart } from '../data/entities/source-part.entity';
import { Source } from '../data/entities/source.entity';
import { getSourceCollections } from '../data/knowledge/source-collections';

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
  let latestSource: Source<{ filePath: string }> = (await (
    await getRepository(Source)
  ).findOne({
    where: { source_collection_id: collection.id }
  })) as any;
  if (latestSource == null) {
    const source = new Source<{ filePath: string }>();
    source.name = 'Test';
    source.metadata = { filePath: 'C:/temp/base' };
    source.source_type = 'FILE';
    source.source_collection = collection;
    source.source_collection_id = collection.id;
    latestSource = await saveEntity(source);
  }
  if (latestSource.source_collection_id != collection.id) {
    latestSource.source_collection_id = collection.id;
    await saveEntity(latestSource);
    throw new Error('Source collection updated');
  }
}

async function knowledgeTest() {
  try {
    const existingCollection = await getTestSourceCollection();
    await getTestFileSource(existingCollection);
  } catch (e) {
    console.error(e);
  }
}

export async function processSource(sourceId: number) {
  const source = await getEntity(Source, sourceId);
  if (source == null) {
    throw new Error('Source not found');
  }
  await source?.process();
}

export const knowledgeEvents = {
  'knowledge.test': knowledgeTest,
  'knowledge.getSourceCollections': getSourceCollections,
  'knowledge.saveSourceCollection': async (collection: SourceCollection) => {
    return await saveObject(SourceCollection, collection);
  },
  'knowledge.saveSource': async (source: Source) => {
    return await saveObject(Source, source);
  },
  'knowledge.getSources': async ({ collectionId }: { collectionId: number }) => {
    return find(Source, { where: { source_collection_id: collectionId, active: true } });
  },
  'knowledge.getSource': async (sourceId: number) => {
    return await getEntity(Source, sourceId);
  },
  'knowledge.getSourceParts': async ({ sourceId }: { sourceId: number }) => {
    return find(SourcePart, { where: { source_id: sourceId, active: true } });
  },
  'knowledge.getSourcePart': async (id: number) => {
    return await getEntity(SourcePart, id);
  },
  'knowledge.search': async (collectionId: number, query: string, options: any) => {
    const collection = await getEntity(SourceCollection, collectionId);
    if (collection == null) {
      throw new Error('Collection not found');
    }
    return await collection.getSimiliar(query, options);
  },
  'knowledge.processSource': processSource
};
