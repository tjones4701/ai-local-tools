import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity as typeormBaseEntity
} from 'typeorm';

@Entity()
export class BaseEntity extends typeormBaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  modified_at!: Date;

  @Column({ type: 'int', nullable: true })
  created_by!: number;

  @Column({ type: 'int', nullable: true })
  modified_by!: number;
}
