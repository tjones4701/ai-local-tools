import { Column, Entity, ManyToOne } from 'typeorm';
import { Source } from './source.entity';

import { BaseEntity } from './base.entity';

@Entity()
export class SourceVersion extends BaseEntity {
  @ManyToOne(() => Source, (source) => source.id)
  source_id!: number;

  @Column({ type: 'int' })
  version_number!: number;
}
