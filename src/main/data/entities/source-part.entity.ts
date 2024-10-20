import { Column, Entity, ManyToOne } from 'typeorm';
import { SourceVersion } from './source-version.entity.ts';

import { BaseEntity } from './base.entity';

@Entity()
export class SourcePart extends BaseEntity {
  @ManyToOne(() => SourceVersion, (sourceVersion) => sourceVersion.id)
  source_version_id!: number;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'simple-array' })
  tags!: string[];
}
