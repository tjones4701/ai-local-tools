import { ConfluenceLoader } from './loaders/confluence.loader';
import { FileLoader } from './loaders/file.loader.ts';
import { Loader } from './loaders/loader';

const loaders = {
  confluence: ConfluenceLoader,
  file: FileLoader
};

export async function getLoader(name: string): Promise<Loader | null> {
  const LoaderClassReference = loaders[name?.toLowerCase()];
  if (LoaderClassReference == null) {
    console.warn('Unable to find loader for: ' + name);
    return null;
  }
  const loader = new LoaderClassReference();

  await loader.initialise();
  return loader;
}
