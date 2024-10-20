import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text' })
  description!: string;
}
