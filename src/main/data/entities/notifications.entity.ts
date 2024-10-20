import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
@Entity()
export class Notification extends BaseEntity {
  @Column('text')
  title!: string;

  @Column('text')
  message!: string;

  @Column('boolean', { default: false })
  read!: boolean;
}
