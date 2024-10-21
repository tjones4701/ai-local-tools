import { pdfConverter } from './pdf.converter';
import { textConverter } from './text.converter';
import { wordConverter } from './word.converter';

export type Converter = (filePath: string) => Promise<string>;
export const converters: { [key: string]: Converter } = {
  doc: wordConverter,
  docx: wordConverter,
  rtf: wordConverter,
  odt: wordConverter,
  pdf: pdfConverter,
  txt: textConverter,
  sql: textConverter,
  md: textConverter,
  csv: textConverter
};

export async function convertFile(filePath: string): Promise<string> {
  const extension: string = filePath.split('.').pop() ?? '.txt';
  const converter = converters[extension];
  if (converter == null) {
    throw new Error('No converter found for ' + extension);
  }
  return await converter(filePath);
}
