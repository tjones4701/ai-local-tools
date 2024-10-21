import { rpcGeneric } from '../server';
import { AsyncState, useAsync } from '../use-async';

export type ClientSourceCollection = {
  id: number;
  name: string;
  description: string;
  metadata: string;
  sources: ClientSource[];
};

export type ClientSource = {
  id: number;
  name: string;
  description: string;
  uri: string;
  sourceType: string;
  metadata: Record<any, any>;
  tags: string;
};

export function getSourceCollections(): Promise<ClientSourceCollection[]> {
  return rpcGeneric('knowledge.getSourceCollections');
}

export function useSourceCollections(): AsyncState<ClientSourceCollection[]> {
  return useAsync(getSourceCollections);
}
