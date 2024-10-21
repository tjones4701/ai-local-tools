import { EventHandler } from '../event';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getNodeLlamaCppClient } from '../lib/node-llama-cpp';

export type NodeLlamaCppApiResponse = {
  model: string;
  content: string;
} | null;

export async function createNodeLlamaCppChatCompletion(
  prompt: ChatCompletionMessageParam[] | ChatCompletionMessageParam
): Promise<NodeLlamaCppApiResponse | null> {
  if (!Array.isArray(prompt)) {
    prompt = [prompt];
  }
  const model = 'llama-2-7b';

  const nodeLlamaCpp = await getNodeLlamaCppClient();
  try {
    const response = await nodeLlamaCpp.createChatCompletion({
      messages: prompt,
      model: model,
      temperature: 0
    });
    return { content: response.choices?.[0]?.message?.content, model: model } as any;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const nodeLlamaCppEvents: Record<string, EventHandler> = {
  createNodeLlamaCppChatCompletion: async (
    messages: ChatCompletionMessageParam | ChatCompletionMessageParam[]
  ) => {
    return await createNodeLlamaCppChatCompletion(messages);
  }
};
