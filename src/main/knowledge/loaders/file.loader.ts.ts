import { saveEntity } from '../../data/datasource';
import { Source } from '../../data/entities/source.entity';
import { saveData } from '../../events/data';
import { convertFile } from '../converters/converters';
import { Loader } from './loader';
import fs from 'fs';

export class FileLoader extends Loader<{ filePath: string }> {
  public async load({ filePath }): Promise<Source> {
    if (this.parent == null) {
      throw new Error('Parent not set');
    }
    let isDirectory = false;

    try {
      isDirectory = fs.lstatSync(filePath).isDirectory();
    } catch (e) {
      throw new Error('Invalid path');
    }

    let files: string[] = [];

    if (isDirectory) {
      files = fs.readdirSync(filePath);
    } else {
      files.push(filePath);
    }

    const filesProcessed: string[] = [];

    const source = new Source();
    source.name = 'File';
    source.source_type = 'FILE';
    source.source_collection = this.parent;
    source.source_collection_id = this.parent.id;
    await saveEntity(source);

    const savedDataPath = await source.getFilesLocation();
    for (const file of files) {
      try {
        const content = await convertFile(`${filePath}/${file}`);
        filesProcessed.push(file);
        const newFilePath = savedDataPath + '/' + file;
        const fileParts = newFilePath.split('.');
        fileParts.pop();
        const fileName = fileParts.join('.');

        const newFileLocation = await saveData(`sources/${fileName}.md`, content);
        console.log(newFileLocation);
      } catch (e) {
        console.error(e);
      }
    }

    return source;
  }
}
