import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Source } from './source.entity';

@Entity()
export class SourceCollection extends BaseEntity {
  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @Column({ type: 'simple-json', nullable: true })
  metadata!: string;

  public setMetadata(data: any) {
    this.metadata = JSON.stringify(data);
  }

  @OneToMany(() => Source, (source) => source.source_collection)
  sources!: Source[];

  getFilePath() {}
}
