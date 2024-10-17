import { rpc } from '@renderer/lib/server';
import { Conversation, ConversationMessage } from '@renderer/lib/text-to-speech';
import { useState } from 'react';

const exampleResponse = [
  { speaker: 'Bob', text: 'Hello Mary, how are you doing today?' },
  { speaker: 'Mary', text: 'I am doing well Bob, how are you?' }
];

export const PodcastScreen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [answer, setAnswer] = useState<typeof exampleResponse>([] as any);
  const askQuestion = async (text: string) => {
    setTopic(text);
    const assistantPromptParts = [
      'You are an assistant that needs to create a short 200 word podcast for an engaging deep dive podcast call the know.',
      'It should be between 2 people named Bob and Mary.',
      `You must ONLY respond in the following json format: ${JSON.stringify(exampleResponse)} without anything extra`
    ];
    const messages = [
      {
        role: 'assistant',
        content: assistantPromptParts.join(' ')
      },
      {
        role: 'user',
        content: 'create a podcast about' + text
      }
    ];
    const response: any = await rpc.createChatCompletion(messages);
    if (response) {
      try {
        setAnswer(JSON.parse(response.content));
      } catch (e) {
        console.log(response.content);
        console.error(e);
      }
    } else {
      console.error('An error occurred');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Podcast Topic"
      />
      <button onClick={() => askQuestion(topic)}>Ask</button>

      <button
        onClick={async () => {
          const conversation: ConversationMessage[] = [];
          for (let i = 0; i < answer.length; i++) {
            const voiceIndex = i % 2;
            const voice = voiceIndex === 0 ? 'alloy' : 'echo';
            conversation.push({ input: answer[i].text, voice });
          }
          const conversationInstance = new Conversation(conversation);
          await conversationInstance.generate();
          await conversationInstance.play();
        }}
      >
        Generate Audio
      </button>
      <br />
      <h1>The Know</h1>
      {answer.map((message, index) => (
        <div key={index}>
          <h2>{message.speaker}</h2>
          <p>{message.text}</p>
        </div>
      ))}
    </div>
  );
};
