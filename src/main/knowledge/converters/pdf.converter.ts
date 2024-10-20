import * as fs from 'fs';
import { replaceString } from '../../lib/replace-string';

import type Pdfparser from 'pdf2json';
import type { Output as PdfDocument } from 'pdf2json';
import { cleanString } from '../../lib/clean-string';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFParser = require('pdf2json');
export class PdfFileLoader {
  static async loadPdfFromBuffer(data: Buffer): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const pdfParser: Pdfparser = new PDFParser();

      pdfParser.on('pdfParser_dataError', (errData) => reject(errData));
      pdfParser.on('pdfParser_dataReady', (pdfData: PdfDocument) => {
        const pageContent: string[] = [];
        for (const i in pdfData.Pages) {
          if (pdfData.Pages[i] == undefined) {
            continue;
          }
          const page = pdfData.Pages[i]?.Texts;
          const lines: Record<number, string> = [];
          for (const lineIndex in page) {
            const element = page[lineIndex as any];
            if (element == undefined) {
              continue;
            }
            const line = element.y;
            for (const rIndex in element.R) {
              if (element.R[rIndex] == undefined) {
                continue;
              }
              const text = element.R[rIndex]?.T;
              lines[line] = `${lines[line] ?? ''}${text}`;
            }
          }
          const lineText = decodeURIComponent(
            replaceString(Object.values(lines).join(''), '%20', ' ')
          ).trim();
          pageContent.push(cleanString(lineText));
        }
        resolve(pageContent);
      });

      pdfParser.parseBuffer(data, 4);
    });
  }
}

export async function pdfConverter(filePath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await PdfFileLoader.loadPdfFromBuffer(fileBuffer);

    return result.join('\n\\pagebreak\n');
  } catch (error) {
    console.error('Error converting Word document to Markdown:', error);
    throw error;
  }
}
