import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SourceVersion } from './source-version.entity.ts';

@Entity()
export class SourcePart {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  modified_at!: Date;

  @Column({ type: 'int' })
  created_by!: number;

  @Column({ type: 'int' })
  modified_by!: number;

  @ManyToOne(() => SourceVersion, (sourceVersion) => sourceVersion.id)
  source_version_id!: number;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'simple-array' })
  tags!: string[];
}
