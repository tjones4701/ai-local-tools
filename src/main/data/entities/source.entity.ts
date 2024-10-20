import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { SourceCollection } from './source-collection.entity';
import { SourceType } from './source-type.entity';

@Entity()
export class Source {
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

  @ManyToOne(() => SourceCollection, (sourceCollection) => sourceCollection.id)
  source_collection_id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'text' })
  uri!: string;

  @ManyToOne(() => SourceType, (sourceType) => sourceType.id)
  source_type!: number;

  @Column({ type: 'text' })
  metadata!: string; // Changed from jsonb to text

  @Column({ type: 'text' })
  tags!: string; // Changed from simple-array to text
}
