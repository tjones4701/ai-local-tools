import React from 'react';
import { DateLib } from '../date';
import { quickHash } from '../quickhash';
import { rpcGeneric } from '../server';
import { AsyncState, useAsync } from '../use-async';

export type ClientSourcePart = {
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

export type SourcePartOptions = {
  sourceId: number;
};

export function getSourceParts({ sourceId }: SourcePartOptions): Promise<ClientSourcePart[]> {
  return rpcGeneric('knowledge.getSourceParts', { sourceId });
}

export function getSourcePart(id: string): Promise<ClientSourcePart> {
  return rpcGeneric('knowledge.getSourcePart', id);
}

export function useSourceParts(props: SourcePartOptions): AsyncState<ClientSourcePart[]> {
  return useAsync(() => getSourceParts(props), [quickHash(props)]);
}

export function processSourcePart(sourceId: number): Promise<void> {
  return rpcGeneric('knowledge.processSourcePart', sourceId);
}

export async function saveSourcePart(part: Partial<ClientSourcePart>): Promise<ClientSourcePart> {
  return rpcGeneric('knowledge.saveSourcePart', part);
}

type SourcePartResponse = AsyncState<ClientSourcePart | undefined> & {
  update: (data: Partial<ClientSourcePart>) => void;
};

export function useSourcePart(id: string): SourcePartResponse {
  const [isSaving, setIsSaving] = React.useState(false);
  const asyncState = useAsync(() => getSourcePart(id), [id]);

  return {
    ...asyncState,
    loading: asyncState.loading || isSaving,
    value: asyncState.value,
    update: async (payload: Partial<ClientSourcePart>) => {
      setIsSaving(true);
      try {
        delete payload.created_at;
        delete payload.created_by;
        if (payload.modified_at == null) {
          payload.modified_at = DateLib.now().toISOString();
        }
        setIsSaving(false);
        return await saveSourcePart(payload);
      } catch (e) {
        setIsSaving(false);
        throw e;
      }
    }
  };
}
