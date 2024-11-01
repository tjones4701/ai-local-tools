import React from 'react';
import { DateLib } from '../date';
import { quickHash } from '../quickhash';
import { rpcGeneric } from '../server';
import { AsyncState, useAsync } from '../use-async';
import { ClientEntity } from './base-entity';

export type ClientSource = ClientEntity<{
  id: number;
  name: string;
  description: string;
  uri: string;
  sourceType: string;
  metadata: Record<any, any>;
  source_collection_id?: number;
  parent_source_id?: number;
  parent_source: ClientSource;
  tags: string;
}>;

type SourceOptions = {
  collectionId: number;
};
export function getSources({ collectionId }: SourceOptions): Promise<ClientSource[]> {
  return rpcGeneric('knowledge.getSources', { collectionId });
}

export function getSource(id: string): Promise<ClientSource> {
  return rpcGeneric('knowledge.getSource', id);
}

export function useSources(props: SourceOptions): AsyncState<ClientSource[]> {
  return useAsync(() => getSources(props), [quickHash(props)]);
}

export function processSource(sourceId: number): Promise<void> {
  return rpcGeneric('knowledge.processSource', sourceId);
}

export async function saveSource(collection: Partial<ClientSource>): Promise<ClientSource> {
  return rpcGeneric('knowledge.saveSource', collection);
}

type SourceResponse = AsyncState<ClientSource | undefined> & {
  update: (data: Partial<ClientSource>) => void;
};

export function useSource(id: string): SourceResponse {
  const [isSaving, setIsSaving] = React.useState(false);
  const asyncState = useAsync(() => getSource(id), [id]);

  return {
    ...asyncState,
    loading: asyncState.loading || isSaving,
    value: asyncState.value,
    update: async (payload: Partial<ClientSource>) => {
      setIsSaving(true);
      try {
        delete payload.created_at;
        delete payload.created_by;
        if (payload.modified_at == null) {
          payload.modified_at = DateLib.now().toISOString();
        }
        setIsSaving(false);
        return await saveSource(payload);
      } catch (e) {
        setIsSaving(false);
        throw e;
      }
    }
  };
}
