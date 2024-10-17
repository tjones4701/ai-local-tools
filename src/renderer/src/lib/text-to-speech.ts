import { rpc } from './server';

type TextToSpeechVoice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export type ConversationMessage = { input: string; voice: TextToSpeechVoice };

export class Conversation {
  messages: ConversationMessage[];
  responses: ArrayBuffer[] = [];
  isGenerating: boolean = false;

  constructor(messages: { input: string; voice: TextToSpeechVoice }[]) {
    this.messages = messages;
  }

  async generate() {
    this.isGenerating = true;
    this.responses = await createConversations(this.messages);
  }
  async play() {
    for (const message of this.responses) {
      await playAudio(message);
    }
  }
}
export async function createConversations(messages: { input: string; voice: TextToSpeechVoice }[]) {
  const promises = messages.map(async (message) => {
    return await createTextToSpeech(message.input, message.voice);
  });
  const allResponses: any = await Promise.all(promises);

  return allResponses as Promise<Array<ArrayBuffer>>;
}

export async function playAudio(data: ArrayBuffer) {
  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(data);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);

  return new Promise<void>((resolve) => {
    source.onended = () => {
      resolve();
    };
    source.start();
  });
}

export async function createTextToSpeech(
  text: string,
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'
): Promise<ArrayBuffer> {
  // This will be an array buffer of an mp3.
  const response: any = await rpc.createTextToSpeech(text, voice);
  const data = response.data;
  return data;
}
