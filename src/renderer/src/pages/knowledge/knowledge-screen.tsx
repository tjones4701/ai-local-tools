import { rpcGeneric } from '@renderer/lib/server';
import { useState } from 'react';

export const HomeScreen: React.FC = () => {
  const [state, setState] = useState<any>(null);
  const test = async () => {
    const result = await rpcGeneric('test');
    setState(result);
  };
  let jsonedData = null;
  try {
    jsonedData = JSON.parse(state);
  } catch (e) {
    console.error(e);
  }

  return (
    <div>
      <button onClick={test}>Test</button>
      <div>
        <pre>{JSON.stringify(jsonedData, null, 2)}</pre>
      </div>
    </div>
  );
};
