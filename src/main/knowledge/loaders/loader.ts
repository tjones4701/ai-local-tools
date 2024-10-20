import { SourceCollection } from '../../data/entities/source-collection.entity';
import { Source } from '../../data/entities/source.entity';

export class Loader<T = undefined> {
  parent?: SourceCollection | null;

  constructor() {}

  public async initialise(): Promise<void> {}

  public load(_options: T): Promise<Source> {
    throw new Error('Method not implemented.');
  }

  public async loadFromSource(source: Source): Promise<Source> {
    this.parent = await source.getSourceCollection();
    console.log(this.parent);
    return this.load(source.metadata as any);
  }
}
