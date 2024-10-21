import { BaseEntity, DataSource, FindManyOptions } from 'typeorm';
import { entities } from './entities';
import { SnakeNamingStrategy } from './snack-naming.strategy';
import { getDatabaseConfiguration, openDatabase } from './sqlite';

let AppDataSource: DataSource | null = null;

const datasourceConfiguration = {
  type: 'sqlite',
  database: getDatabaseConfiguration().filename,
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
  entities: [...entities]
};

export async function getDatasource() {
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

export async function saveEntity<T = BaseEntity>(entity: T): Promise<T> {
  const repository = await getRepository((entity as any).constructor as any);
  await repository.save(entity as any);

  return entity;
}

export async function getEntity<T = BaseEntity>(Entity: { new (): T }, id: any): Promise<T | null> {
  const repository = await getRepository(Entity);
  return (await repository.findOne({
    where: {
      id
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
