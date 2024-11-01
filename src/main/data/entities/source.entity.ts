import { chunk } from 'llm-chunk';
import { Column, Entity, ManyToOne } from 'typeorm';
import { getData, getFiles } from '../../events/data';
import { generateVectors } from '../../knowledge/embeddings/embedder';
import { getLoader } from '../../knowledge/source-loader';
import { createEntity, deleteEntity, find, getEntity } from '../datasource';
import { BaseEntity } from './base.entity';
import { SourceCollection } from './source-collection.entity';
import { SourcePart } from './source-part.entity';

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
  source_collection!: SourceCollection<unknown>;

  @ManyToOne(() => Source, (source) => source.id, { nullable: true })
  parent_source!: Source<unknown> | null;

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

  @Column({ type: 'number' })
  source_collection_id!: number;

  @Column({ type: 'number', nullable: true })
  parent_source_id!: number;

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

  public async getSourceParts() {
    return await find(SourcePart, {
      where: {
        source_id: this.id
      }
    });
  }

  public async processParts() {
    const files = await this.getSourceFiles();

    const parts: SourcePart[] = [];
    const idsToDelete = (await this.getSourceParts()).map((part) => part.id);
    for (const file of files) {
      const content = await getData<string>(file, '');
      if (content == '') {
        continue;
      }

      // Default options
      const chunks = chunk(content, {
        minLength: 7, // number of minimum characters into chunk
        maxLength: 750, // number of maximum characters into chunk
        splitter: 'paragraph', // paragraph | sentence
        overlap: 50, // number of overlap chracters
        delimiters: '' // regex for base split method
      });

      for (const part of chunks) {
        const sourcePart = new SourcePart();
        sourcePart.source_id = this.id;
        sourcePart.content = part;
        sourcePart.embedding_vector = await generateVectors(part);
        const savedPart = await createEntity(SourcePart, sourcePart);
        parts.push(savedPart);
      }
    }

    for (const id of idsToDelete) {
      await deleteEntity(SourcePart, id);
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
    let filePath = `sources/${this.source_collection_id}/${this.id}`;
    return filePath;
  }

  public async generateParts() {}
}
