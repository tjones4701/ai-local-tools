import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { ValueTransformer } from 'typeorm';
import { Source } from './source.entity.js';

export class SqliteVecTransformer implements ValueTransformer {
  to(value: number[]): string {
    return JSON.stringify(value);
  }

  from(value: string): number[] {
    return JSON.parse(value);
  }
}

@Entity()
export class SourcePart extends BaseEntity {
  @ManyToOne(() => Source, (source) => source.id)
  source_id!: number;

  @Column({ type: 'text', nullable: true })
  summary!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', transformer: new SqliteVecTransformer() })
  embedding_vector!: number[];

  @Column({ type: 'simple-array', nullable: true })
  tags!: string[];
}
