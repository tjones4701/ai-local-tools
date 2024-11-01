import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { find } from '../datasource';

export enum JobStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Failed = 'failed'
}

@Entity()
export class QueuedJob extends BaseEntity {
  @Column({ type: 'simple-json', nullable: true })
  data!: any;

  @Column({ type: 'text' })
  job_type!: string;

  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.Pending
  })
  status!: JobStatus;

  @Column({ type: 'integer', default: 0 })
  priority!: number;

  @Column({ type: 'datetime', nullable: true })
  scheduled_time!: Date;

  @Column({ type: 'datetime', nullable: true })
  completed_time!: Date;

  @Column({ type: 'text', nullable: true })
  error_message!: string;

  static async getJobToRun() {
    await find(QueuedJob, {
      where: { status: JobStatus.Pending },
      order: { priority: 'ASC', created_at: 'ASC' }
    });
  }
}
