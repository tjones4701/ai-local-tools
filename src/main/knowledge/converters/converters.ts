import { NodeHtmlMarkdown } from 'node-html-markdown';
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

export async function toMarkdown(content: string): Promise<string> {
  const lines = content.split('\n').slice(0, 5);
  console.log(lines.join('\n'));
  if (lines.some((line) => line.startsWith('<html>'))) {
    return content;
  }

  return NodeHtmlMarkdown.translate(content);
}
