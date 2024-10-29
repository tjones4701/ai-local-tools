import React from 'react';
import { DateLib } from '../date';
import { rpcGeneric } from '../server';
import { AsyncState, useAsync } from '../use-async';
import { ClientEntity } from './base-entity';
import { ClientSource } from './source.client';
import { ClientSourcePart } from './source-part.client';

export type ClientSourceCollection = ClientEntity<{
  id: number;
  name: string;
  description: string;
  metadata: string;
  sources: ClientSource[];
}>;

export async function saveSourceCollection(
  collection: Partial<ClientSourceCollection>
): Promise<ClientSourceCollection> {
  return rpcGeneric('knowledge.saveSourceCollection', collection);
}

export function getSourceCollections(): Promise<ClientSourceCollection[]> {
  return rpcGeneric('knowledge.getSourceCollections');
}

export function searchSourceCollection(id: number, content: string): Promise<ClientSourcePart[]> {
  return rpcGeneric('knowledge.search', id, content);
}

export function useSourceCollections(): AsyncState<ClientSourceCollection[]> {
  return useAsync(getSourceCollections);
}

type SourceCollectionResponse = AsyncState<ClientSourceCollection | undefined> & {
  update: (data: Partial<ClientSourceCollection>) => void;
};

export function useSourceCollection(id: string): SourceCollectionResponse {
  const [isSaving, setIsSaving] = React.useState(false);
  const asyncState = useSourceCollections();

  return {
    ...asyncState,
    loading: asyncState.loading || isSaving,
    value: asyncState.value?.find((collection) => collection.id === +id),
    update: async (payload: Partial<ClientSourceCollection>) => {
      setIsSaving(true);
      try {
        delete payload.created_at;
        delete payload.created_by;
        console.log(payload);
        if (payload.modified_at == null) {
          payload.modified_at = DateLib.now().toISOString();
        }
        setIsSaving(false);
        return await saveSourceCollection(payload);
      } catch (e) {
        setIsSaving(false);
        throw e;
      }
    }
  };
}
