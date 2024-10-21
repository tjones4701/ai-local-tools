import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  active!: boolean;

  @CreateDateColumn({ type: 'datetime', default: 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @CreateDateColumn({ type: 'datetime', default: 'CURRENT_TIMESTAMP' })
  modified_at!: Date;

  @Column({ type: 'int', nullable: true })
  created_by!: number;

  @Column({ type: 'int', nullable: true })
  modified_by!: number;
}
