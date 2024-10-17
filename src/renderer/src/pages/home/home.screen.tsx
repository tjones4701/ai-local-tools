import { rpc } from '@renderer/lib/server';
import { useState } from 'react';

export const HomeScreen: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const askQuestion = async (text: string) => {
    setQuestion(text);
    const response: any = await rpc.createChatCompletion({
      role: 'assistant',
      content: text
    });
    if (response) {
      setAnswer(response.content);
    } else {
      setAnswer('An error occurred');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a question"
      />
      <button onClick={() => askQuestion(question)}>Ask</button>
      <p>{answer}</p>
    </div>
  );
};
