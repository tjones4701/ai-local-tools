import { EventHandler } from '../event';

type TransformerPayload = {
  modelType: any;
  input: string;
  model: string;
};

export const transformerEvents: Record<string, EventHandler> = {
  'transformers.run': async (payload: TransformerPayload): Promise<any | Error> => {
    try {
      // Dynamically import the pipeline function
      const { env, AutoTokenizer, AutoModelForCausalLM } = await import('@xenova/transformers');

      const tokenizer = await AutoTokenizer.from_pretrained('HuggingFaceTB/SmolLM-135M');
      const model = await AutoModelForCausalLM.from_pretrained('HuggingFaceTB/SmolLM-135M', {
        model_file_name: 'model'
      });

      env.localModelPath = false;
      env.allowLocalModels = false;
      env.localModelPath = '';

      // Allocate a pipeline for sentiment-analysis
      //   let pipe = await pipeline(payload.modelType, payload.model);
      const input = tokenizer.encode(payload.input);
      const output = await model(input);
      return output;
    } catch (e) {
      console.error(e);
      return e;
    }
  }
};
