import { Source } from '../../data/entities/source.entity';

export class Loader<T = undefined> {
  parent?: Source | null;

  constructor(source: Source) {
    this.parent = source;
  }

  public async initialise(): Promise<void> {}

  public load(_options: T): Promise<Source> {
    throw new Error('Method not implemented.');
  }

  public async loadFromSource(source: Source): Promise<Source> {
    this.parent = source;
    return this.load(source.metadata as any);
  }
}
