import * as fs from 'fs';
import * as mammoth from 'mammoth';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export async function wordConverter(filePath: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await mammoth.convertToHtml({ buffer: fileBuffer });
    return NodeHtmlMarkdown.translate(result.value);
  } catch (error) {
    console.error('Error converting Word document to Markdown:', error);
    throw error;
  }
}
