import { Column, Entity, ManyToOne } from 'typeorm';
import { getData, getFiles } from '../../events/data';
import { getLoader } from '../../knowledge/source-loader';
import { createEntity, getEntity } from '../datasource';
import { BaseEntity } from './base.entity';
import { SourceCollection } from './source-collection.entity';
import { SourcePart } from './source-part.entity';
import { generateVectors } from '../../knowledge/embeddings/embedder';

function splitStringByWords(text: string, words: number) {
  const splitters = [' ', '\\pagebreak'];
  const regex = new RegExp(splitters.join('|'), 'g');
  text = text.replace(regex, ' ');

  const wordsArray = text.split(' ');
  const result: string[] = [];
  for (let i = 0; i < wordsArray.length; i += words) {
    result.push(wordsArray.slice(i, i + words).join(' '));
  }
  return result;
}

@Entity()
export class Source<T = undefined> extends BaseEntity {
  @ManyToOne(() => SourceCollection, (sourceCollection) => sourceCollection.id)
  source_collection!: SourceCollection;

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

  source_collection_id!: number;

  public async process() {
    if (this.id == null) {
      throw new Error('Source must be saved before processing');
    }
    if (this.metadata == null) {
      this.metadata = {
        filePath: 'C:/temp/9xr2c'
      } as any;
    }
    const load = await getLoader(this.source_type);
    if (load == null) {
      throw new Error('Unable to load source');
    }
    await load.loadFromSource(this as any);

    await this.processParts();
  }

  public async processParts() {
    const files = await this.getSourceFiles();

    const parts: SourcePart[] = [];
    for (const file of files) {
      const content = await getData<string>(file, '');
      if (content == '') {
        continue;
      }

      const contentParts = splitStringByWords(content, 1000);
      for (const part of contentParts) {
        const sourcePart = new SourcePart();
        sourcePart.source_id = this.id;
        sourcePart.content = part;
        sourcePart.embedding_vector = await generateVectors(part);
        const savedPart = await createEntity(SourcePart, sourcePart);
        parts.push(savedPart);
      }
    }
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

  public async getSourceFiles() {
    const filesLocation = await this.getFilesLocation();
    const files = await getFiles(await this.getFilesLocation());

    return files.map((file) => {
      return `${filesLocation}/${file}`;
    });
  }

  async getFilesLocation() {
    if (this.source_collection == null) {
      throw new Error('Source collection not found');
    }
    let filePath = `sources/${this.source_collection_id}/${this.id}`;
    return filePath;
  }

  public async generateParts() {}
}
