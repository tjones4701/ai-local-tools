import { miniLmEmbeddingsGenerator } from './all-MiniLM-L6-v2.transformer';

export async function generateVectors(text: string): Promise<number[]> {
  const tensor = await miniLmEmbeddingsGenerator(text);
  return Array.from(tensor.data);
}
