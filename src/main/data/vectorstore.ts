import { VectorDB } from 'imvectordb';

export type VectorItem = {
  id: string;
  embedding: number[];
};

export async function vectorSearch(
  searchEmbeddings: number[],
  content: VectorItem[],
  options: { limit: number } = { limit: 10 }
) {
  const db = new VectorDB();

  let searchResults: {
    similiarity: number;
    document: { id: number; embedding: number[]; metadata: any };
  }[] = [];
  try {
    // Add a new document to the database
    for (const item of content) {
      db.add({ ...item, metadata: {} });
    }

    // Perform a search and retrieve the top 10 similar documents
    const queryVector = searchEmbeddings;
    searchResults = await db.query(queryVector, options.limit);
  } catch (error) {
    console.error(error);
  }

  // Terminate the Worker when it's no longer needed or when the server closes
  db.terminate();
  return searchResults;
}
