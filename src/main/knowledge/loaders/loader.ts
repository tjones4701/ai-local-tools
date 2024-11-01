import { Source } from '../../data/entities/source.entity';

export class Loader<T = undefined> {
  parent?: Source<T> | null;

  constructor(source: Source<T>) {
    this.parent = source;
  }

  public async initialise(): Promise<void> {}

  public load(_options: T): Promise<Source<T>> {
    throw new Error('Method not implemented.');
  }

  public async loadFromSource(source: Source<T>): Promise<Source<T>> {
    this.parent = source;

    if (this.parent == null) {
      throw new Error('Parent not set');
    }
    return this.load(source.metadata as any);
  }

  public log(type: 'log' | 'debug', ...parts: any[]): void {
    console?.[type](`[source ${this.parent?.id ?? '-1'}]`, ...parts);
  }
}
