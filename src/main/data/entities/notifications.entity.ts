import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  title!: string;

  @Column('text')
  message!: string;

  @Column('boolean', { default: false })
  read!: boolean;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
