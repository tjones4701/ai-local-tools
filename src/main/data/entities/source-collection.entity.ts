import { BeforeInsert, Column, Entity, In, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Source } from './source.entity';
import { find } from '../datasource';
import { generateVectors } from '../../knowledge/embeddings/embedder';
import { SourcePart } from './source-part.entity';
import { vectorSearch } from '../vectorstore';

@Entity()
export class SourceCollection<T = any> extends BaseEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: T; // Changed from jsonb to text

  @OneToMany(() => Source, (source) => source.source_collection)
  sources!: Source[];

  @BeforeInsert()
  updateMetadata() {
    this.metadata = this.metadata ?? ({} as T);
  }

  public async getSources(active: boolean = true) {
    return find(Source, {
      where: {
        source_collection_id: this.id,
        active
      }
    });
  }

  public async getSimiliar(content: string, options: any = {}) {
    try {
      const sourceIds = (await this.getSources()).map((source) => source.id);
      const vectors = await generateVectors(content);
      const searchItems = await find(SourcePart, {
        where: {
          source_id: In(sourceIds),
          active: true
        }
      });

      const items = await vectorSearch(
        vectors,
        searchItems.map((item) => {
          return {
            id: item.id,
            embedding: item.embedding_vector
          };
        }),
        options
      );
      const ids: number[] = items.map((result) => result.document.id);
      return find(SourcePart, {
        where: {
          id: In(ids),
          active: true
        }
      });
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  getFilePath() {}
}
