import { ChatCompletionMessageParam } from 'openai/resources';
import { rpcGeneric } from '../server';

export async function createChatComplete(
  messages: ChatCompletionMessageParam | ChatCompletionMessageParam[]
): Promise<{
  content: string;
  model: string;
}> {
  return await rpcGeneric('openai.createChatComplete', messages);
}
