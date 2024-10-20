import { Column, Entity, ManyToOne } from 'typeorm';
import { getEntity } from '../datasource';
import { BaseEntity } from './base.entity';
import { SourceCollection } from './source-collection.entity';
import { getLoader } from '../../knowledge/source-loader';

@Entity()
export class Source<T = undefined> extends BaseEntity {
  @ManyToOne(() => SourceCollection, (sourceCollection) => sourceCollection.id)
  source_collection_id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'text', nullable: true })
  uri!: string;

  @Column({ type: 'text' })
  source_type!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: T; // Changed from jsonb to text

  @Column({ type: 'text', nullable: true })
  tags!: string; // Changed from simple-array to text

  source_collection?: SourceCollection;

  public async process() {
    const load = await getLoader(this.source_type);
    if (load == null) {
      throw new Error('Unable to load source');
    }
    return load.loadFromSource(this as any);
  }

  public async getSourceCollection() {
    if (this.source_collection != null) {
      return this.source_collection;
    }
    const collection = await getEntity(SourceCollection, this.source_collection_id);
    if (collection == null) {
      throw new Error('Source collection not found');
    }
    this.source_collection = collection;
    return collection;
  }

  async getFilesLocation() {
    if (this.source_collection == null) {
      throw new Error('Source collection not found');
    }
    let filePath = `${this.source_collection_id}/${this.id}`;
    return filePath;
  }
}
