import { getRepository } from '../datasource';
import { SourceCollection } from '../entities/source-collection.entity';

export async function getSourceCollections() {
  const repository = await getRepository(SourceCollection);
  return repository.find();
}
