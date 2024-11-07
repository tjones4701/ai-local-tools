import { rpcGeneric } from '../server';

export type TransformerPayload = {
  modelType: any;
  input: string;
  model: string;
};

export async function runTransformer(payload: TransformerPayload): Promise<any> {
  return await rpcGeneric('transformers.run', payload);
}
