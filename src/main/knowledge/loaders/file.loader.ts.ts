import fs from 'fs';
import { Source } from '../../data/entities/source.entity';
import { saveData } from '../../events/data';
import { convertFile } from '../converters/converters';
import { Loader } from './loader';

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

    const source = this.parent;

    const savedDataPath = await source.getFilesLocation();
    for (const file of files) {
      try {
        const content = await convertFile(`${filePath}/${file}`);
        filesProcessed.push(file);
        const newFilePath = savedDataPath + '/' + file;
        const fileParts = newFilePath.split('.');
        const oldExtension = fileParts.pop();
        const fileName = fileParts.join('.');

        await saveData(`${fileName}_${oldExtension}.md`, content);
      } catch (e) {
        console.error(e);
      }
    }

    return source;
  }
}
