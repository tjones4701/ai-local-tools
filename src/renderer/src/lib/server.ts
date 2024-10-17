const callbacks: Record<string, CallbackHandler> = {};

const generateUniqueId = () => {
  const uid = Math.random().toString(36).substr(2, 9);
  if (callbacks[uid] != null) {
    return generateUniqueId();
  }
  return uid;
};

class CallbackHandler {
  name: string;
  args: any[];
  private id: string = generateUniqueId();
  private resolve?: (response: any) => void;
  private reject?: (error: Error) => void;
  executed: boolean = false;
  constructor(name: string, args: any[]) {
    this.name = name;
    this.args = args;
  }

  execute(): Promise<any> {
    if (this.executed) {
      throw new Error('Callback already executed');
    }

    this.executed = true;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      callbacks[this.id] = this;
      ipcRenderer.send('event', {
        event: this.name,
        args: this.args,
        id: this.id
      });
    });
  }

  respond(response: any, error: Error) {
    if (error) {
      this.reject?.(error);
    } else {
      this.resolve?.(response);
    }
  }
}

const ipcRenderer = window.electron.ipcRenderer;

const handleCallback = (_event, message) => {
  const { id, response, error } = message;
  const callback = callbacks[id];
  if (!callback) {
    throw new Error(`Callback with id ${id} not found`);
  }
  callback.respond(response, error);
};
ipcRenderer.on('event-callback', handleCallback);

export async function rpcGeneric<T>(name: string, ...args: any[]): Promise<T> {
  const callback = new CallbackHandler(name, args);
  return await callback.execute();
}

export const rpc = {
  random: async () => {
    return await rpcGeneric('random');
  },
  saveData: async (key: string, data: any): Promise<boolean> => {
    return await rpcGeneric('saveData', key, data);
  },
  getData: async <T>(fileName: string, defaultValue?: T | null): Promise<T | null> => {
    return await rpcGeneric('getData', fileName, defaultValue);
  },
  createChatCompletion: async (messages: any) => {
    return await rpcGeneric('createChatComplete', messages);
  },
  createTextToSpeech: async (text: string, voice: string) => {
    return await rpcGeneric('createTextToSpeech', text, voice);
  }
};
