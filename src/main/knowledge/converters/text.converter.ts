import * as fs from 'fs';

export async function textConverter(filePath: string): Promise<string> {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}
