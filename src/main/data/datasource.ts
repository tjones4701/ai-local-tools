import { BaseEntity, DataSource, FindManyOptions } from 'typeorm';
import { entities } from './entities';
import { SnakeNamingStrategy } from './snack-naming.strategy';
import { getDatabaseConfiguration, openDatabase } from './sqlite';
import { sleep } from '../lib/sleep';

let AppDataSource: DataSource | null = null;

const datasourceConfiguration = {
  type: 'sqlite',
  database: getDatabaseConfiguration().filename,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [...entities]
};

export async function getDatasource(tries: number = 0) {
  try {
    const database = await openDatabase();

    if (AppDataSource == null) {
      AppDataSource = new DataSource({
        ...datasourceConfiguration,
        database: database.path
      } as any);
    }

    if (AppDataSource.isInitialized) {
      return AppDataSource;
    }
    await AppDataSource.initialize();

    return AppDataSource;
  } catch (e) {
    if (tries < 10) {
      console.warn(e);
      console.warn('Database connection failed, retrying');

      await sleep(1000);
      return getDatasource(tries + 1);
    } else {
      console.error('Database connection failed');
      throw e;
    }
  }
}

export async function getRepository<T>(entity: { new (): T }) {
  return (await getDatasource()).getRepository(entity);
}

export async function createEntity<T = BaseEntity>(
  Entity: { new (): T },
  data: Partial<T>
): Promise<T> {
  const newEntity: any = new Entity();
  for (const key in data) {
    newEntity[key] = data[key] as any;
  }
  return await saveEntity(newEntity);
}

function cleanEntity(entity: any) {
  if (!entity.created_at || isNaN(new Date(entity.created_at).getTime())) {
    entity.created_at = new Date().toISOString();
  }

  entity.modified_at = new Date().toISOString();

  return entity;
}

export async function saveObject<T = BaseEntity>(
  Entity: { new (): T },
  data: any
): Promise<T | null> {
  if (!data.id) {
    return await createEntity(Entity, cleanEntity(data));
  }

  return patchEntity(Entity, data.id, cleanEntity(data));
}

export async function saveEntity<T = BaseEntity>(entity: T): Promise<T> {
  const repository = await getRepository((entity as any).constructor as any);

  await repository.save(cleanEntity(entity));

  return entity;
}

export async function getEntity<T = BaseEntity>(Entity: { new (): T }, id: any): Promise<T | null> {
  const repository = await getRepository(Entity);
  return (await repository.findOne({
    where: {
      id,
      active: true
    }
  })) as any;
}

export async function find<T = BaseEntity>(
  Entity: { new (): T },
  options: FindManyOptions<T> | undefined
): Promise<any[]> {
  const repository = await getRepository(Entity);
  return await repository.find({
    loadRelationIds: true,
    ...(options as any)
  });
}

export async function deleteEntity<T = BaseEntity>(Entity: { new (): T }, id: any): Promise<void> {
  const repository = await getRepository(Entity);
  await repository.delete({
    id: id
  });
}

export async function patchEntity<T = BaseEntity>(
  Entity: { new (): T },
  id: any,
  data: Partial<T>
): Promise<T> {
  const entity = await getEntity(Entity, id);
  if (!entity) {
    throw new Error('Entity not found');
  }
  for (const key in data) {
    entity[key] = data[key] as any;
  }
  return await saveEntity(entity);
}

export async function getTableName<T = BaseEntity>(entity: { new (): T }) {
  const repository = await getRepository(entity as any);
  return repository.metadata.tableName;
}

export type SimiliarDocumentsOptions = {
  limit?: number;
  where?: any;
};
export async function findSimilarDocuments(
  tableName: string,
  fieldName: string,
  embedding: number[],
  options: SimiliarDocumentsOptions
) {
  const db = await getDatasource();
  const embeddingStr = JSON.stringify(embedding);
  const queryBuilder = db
    .createQueryBuilder()
    .select(['id', `vec_distance_L2(${fieldName}, :embedding) as distance`])
    .from(tableName, tableName)
    .where(options.where)
    .orderBy('distance')
    .limit(options.limit)
    .setParameters({ embedding: embeddingStr });

  return await queryBuilder.getRawMany();
}
