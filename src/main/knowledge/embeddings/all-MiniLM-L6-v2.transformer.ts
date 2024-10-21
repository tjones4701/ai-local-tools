const TransformersApi = Function('return import("@xenova/transformers")')();

export async function miniLmEmbeddingsGenerator(text: string) {
  const { pipeline } = await TransformersApi;
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const response = await extractor([text], { pooling: 'mean', normalize: true });
  return response;
}
