import fs from 'fs';
import { Source } from '../../data/entities/source.entity';
import { saveData } from '../../events/data';
import { convertFile } from '../converters/converters';
import { Loader } from './loader';
import { find, saveEntity } from '../../data/datasource';
import { concurrentPromises } from '../../lib/concurrent-promises';

type FileLoaderOptions = {
  filePath: string | string[];
};
type FileLoaderSource = Source<FileLoaderOptions>;
export class FileLoader extends Loader<FileLoaderOptions> {
  public async load({ filePath }): Promise<FileLoaderSource> {
    this.log('debug', 'Starting Loading:', filePath);
    if (this.parent == null) {
      throw new Error('Parent not set');
    }

    let originalFileUrls: string[] = [];
    if (!Array.isArray(filePath)) {
      originalFileUrls.push(filePath);
    } else {
      originalFileUrls = filePath;
    }

    let isDirectory = false;

    try {
      isDirectory = fs.lstatSync(filePath).isDirectory();
    } catch (e) {
      throw new Error('Invalid path');
    }

    if (isDirectory) {
      originalFileUrls = fs.readdirSync(filePath).map((file) => filePath + '/' + file);
    }

    let isMultipleFiles = isDirectory || originalFileUrls.length > 1;
    // If multiple files, create a new source for each file

    if (isMultipleFiles) {
      this.log('debug', 'Multiple files detected, determining new sources to create.');

      let existingSources = await find(Source, {
        where: {
          parent_source_id: this.parent.id
        }
      });

      let newSources: FileLoaderSource[] = [];
      for (const file of originalFileUrls) {
        if (existingSources.find((existingSource) => existingSource.metadata?.filePath === file)) {
          this.log('debug', 'Source already exists:', file);
          continue;
        }
        const newSource = new Source<FileLoaderOptions>();
        newSource.metadata = { filePath: file };
        newSource.source_collection_id = this.parent.source_collection_id;
        newSource.source_type = 'file';
        newSource.parent_source_id = this.parent.id;
        newSource.name = file;
        newSources.push(await saveEntity(newSource));
      }

      this.log('debug', `Saving new sources (${newSources.length})`);
      for (const newSource of newSources) {
        await newSource.save();
      }
      let allSources = existingSources.concat(newSources);
      this.log('debug', `Processing sources (${allSources.length})`);
      const results = await concurrentPromises<void>(
        allSources.map((sourceToProcess) => {
          return () => {
            return sourceToProcess.process();
          };
        }),
        10
      );
      this.log(
        'debug',
        `Processing complete:`,
        `Success (${results.successful?.length})`,
        `Errors: ${results.errors?.length}`
      );
      if (results.errors.length > 0) {
        for (const error of results.errors) {
          console.error(error);
        }
      }
      return this.parent;
    } else {
      this.log('debug', 'Single File:', filePath);
      const source = this.parent;
      const savedDataPath = await source.getFilesLocation();

      try {
        let originalFileName = filePath.split('/').pop();
        const content = await convertFile(`${filePath}`);

        const newFilePath = savedDataPath + '/' + originalFileName;
        const fileParts = newFilePath.split('.');
        const oldExtension = fileParts.pop();
        const fileName = fileParts.join('.');

        await saveData(`${fileName}_${oldExtension}.md`, content);
      } catch (e) {
        console.error(e);
      }
    }

    return this.parent;
  }
}
