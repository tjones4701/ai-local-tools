import { Source } from '../../data/entities/source.entity';
import { Loader } from './loader';

export class ConfluenceLoader extends Loader {
  public load(): Promise<Source> {
    throw new Error('Method not implemented.');
  }
}
