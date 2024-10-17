import OpenAi from 'openai';
import { getSettings } from './settings';

export type Deployments = 'embedder-ada-002' | 'gpt-35-turbo-1106';
export async function getOpenAiClient() {
  const apiKey = await getSettings('API_KEYS', 'OPENAI_API_KEY', '');
  if (apiKey == '') {
    throw new Error('OpenAI API Key is not set');
  }

  return new OpenAi({
    apiKey: apiKey
  });
}
