import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  Models
} from 'openai/resources';
import { EventHandler } from '../event';
import { getOpenAiClient } from '../lib/openai';

export type OpenAIApiResponse = {
  model: Models;
  content: string;
} | null;

export async function createChatCompletion(
  prompt: ChatCompletionMessageParam[] | ChatCompletionMessageParam
): Promise<OpenAIApiResponse | null> {
  if (!Array.isArray(prompt)) {
    prompt = [prompt];
  }
  const model = 'gpt-4o-mini';

  const openai = await getOpenAiClient();
  try {
    const createPayload: ChatCompletionCreateParamsNonStreaming = {
      messages: prompt,
      model: model,
      temperature: 0
    };
    const response = await openai.chat.completions.create(createPayload);
    return { content: response.choices?.[0]?.message?.content, model: model } as any;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type TextToSpeechVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
export async function createTextToSpeech(text: string, voice: TextToSpeechVoice) {
  const openai = await getOpenAiClient();
  try {
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text
    });

    return { data: await response.arrayBuffer() };
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const openaiEvents: Record<string, EventHandler> = {
  'openai.createChatComplete': async (
    messages: ChatCompletionMessageParam | ChatCompletionMessageParam[]
  ) => {
    return await createChatCompletion(messages);
  },
  createTextToSpeech: async (text: string, voice: TextToSpeechVoice) => {
    return await createTextToSpeech(text, voice);
  }
};
