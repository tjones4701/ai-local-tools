import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class SourceCollection {
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

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  location!: string;

  @Column({ type: 'text' })
  description!: string;
}
