export type SourcePart = {
  id: number;
  active: boolean;
  created_at: string;
  modified_at: string;
  created_by: string | null;
  modified_by: string | null;
  source_id: number;
  summary: string | null;
  content: string;
  embedding_vector: number[];
  tags: string[] | null;
};
