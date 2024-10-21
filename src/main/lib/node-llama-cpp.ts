import { fileURLToPath } from 'url';
import path from 'path';
const TransformersApi = Function('return import("@xenova/transformers")')();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function getNodeLlamaCppClient() {
  const { getLlama, LlamaChatSession } = await TransformersApi;

  const llama = await getLlama();
  const model = await llama.loadModel({
    modelPath: path.join(__dirname, 'models', 'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf')
  });
  const context = await model.createContext();
  const session = new LlamaChatSession({
    contextSequence: context.getSequence()
  });

  return session;
}
