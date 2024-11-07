import { RouteElement } from '@renderer/app-router';
import ContainerHeader from '@renderer/components/container/ContainerHeader';
import ContainerSection from '@renderer/components/container/ContainerSection';
import { Page } from '@renderer/components/page';
import { runTransformer, TransformerPayload } from '@renderer/lib/data/transformers';
import FEInput from '@renderer/quick-form/inputs/fe-input';
import FESelect from '@renderer/quick-form/inputs/fe-select';
import QuickForm from '@renderer/quick-form/QuickForm';
import { useQuickFormContext } from '@renderer/quick-form/use-quick-form';
import { useState } from 'react';


const modelTypeKeys = [
    "audio-classification",
    "automatic-speech-recognition",
    "depth-estimation",
    "document-question-answering",
    "feature-extraction",
    "fill-mask",
    "image-classification",
    "image-segmentation",
    "image-to-text",
    "object-detection",
    "question-answering",
    "summarization",
    "text2text-generation",
    "text-classification",
    "text-generation",
    "token-classification",
    "translation",
    "translation_xx_to_yy",
    "zero-shot-classification",
    "zero-shot-audio-classification",
    "zero-shot-image-classification",
    "zero-shot-object-detection"
];

const modelTemplates: (TransformerPayload & { name: string })[] = [
    {
        name: 'SMOLLM-135',
        modelType: "text-generation",
        input: 'Hello world',
        model: '/HuggingFaceTB/SmolLM-135M'
    },
    {
        name: 'Bert Sentiment',
        modelType: 'sentiment-analysis',
        input: 'I love transformers',
        model: 'nlptown/bert-base-multilingual-uncased-sentiment'
    }
];

function FETemplateSelect() {
    const context = useQuickFormContext();
    const onChange = (value) => {
        const template = modelTemplates.find((item) => item.name == value);
        console.log(template);
        if (template == undefined) {
            return;
        }
        context.setValues(template);
    }
    return (
        <FESelect label="Model" hasEmpty onSelectChange={onChange} name="template" items={modelTemplates.map((item) => {
            return {
                label: item.name,
                id: item.name
            }
        })} required />
    );
}



function ModelResponse({ children }: { children: any | Error }) {
    let content: any = null;
    if (children instanceof Error) {
        content = children.message;
    } else if (children == null || children == "") {
        content = "";
    }
    else {
        content = children;
    }
    return <>{content}</>;
}
export const TestScreen: RouteElement = () => {
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (newValue) => {
        const result = await runTransformer(newValue);
        setResponse(result);
    }
    return (
        <Page label="test">
            <ContainerSection>
                <QuickForm onSubmit={handleSubmit} defaultValues={modelTemplates?.[0]}>
                    <FETemplateSelect />
                    <FESelect label="Model" name="modelType" items={modelTypeKeys.map((key) => ({ label: key, id: key }))} required />
                    <FEInput label="Model" name="model" required />
                    <FEInput label="Input" type="textarea" name="input" required />
                </QuickForm>
            </ContainerSection>
            <ContainerHeader>Responds</ContainerHeader>
            <ContainerSection>
                <ModelResponse>{response}</ModelResponse>
            </ContainerSection>

        </Page>
    );
};
