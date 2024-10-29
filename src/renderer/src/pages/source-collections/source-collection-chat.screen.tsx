import { Card, Text } from '@fluentui/react-components';
import ContainerHeader from '@renderer/components/container/ContainerHeader';
import ContainerSection from '@renderer/components/container/ContainerSection';
import Loading from '@renderer/components/loading';
import { Page } from '@renderer/components/page';
import { createChatComplete } from '@renderer/lib/data/open-ai';
import {
  ClientSourceCollection,
  searchSourceCollection,
  useSourceCollection
} from '@renderer/lib/data/source-collection.client';
import { ClientSourcePart } from '@renderer/lib/data/source-part.client';
import FeInput from '@renderer/quick-form/inputs/fe-input';
import QuickForm from '@renderer/quick-form/QuickForm';
import { ChatCompletionMessageParam } from 'openai/resources';
import { useState } from 'react';

function Screen({ children }: { children: ClientSourceCollection }) {
  const [searchState, setSearchState] = useState<{
    loading: Boolean;
    results: any[];
    response: string;
    error: any;
  }>({
    loading: false,
    results: [],
    response: '',
    error: null
  });

  const handleSearch = async (data: any) => {
    setSearchState({ ...searchState, loading: true });
    let results = await searchSourceCollection(children.id, data.query);
    const messages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: data.prompt
      },
      {
        role: 'system',
        content: `The content related is as follows: ${results.map((result) => result.content).join('\n')}`
      },
      {
        role: 'user',
        content: data.query
      }
    ];

    const response = await createChatComplete(messages);

    setSearchState({ ...searchState, loading: false, results, response: response?.content });
  };

  const defaultPrompt = [
    'You are a friendly assistant that will help the user finding information related to them.'
  ];

  return (
    <>
      <ContainerSection>
        <QuickForm onSubmit={handleSearch} defaultValues={{ prompt: defaultPrompt.join('\n') }}>
          <FeInput name="prompt" label="Prompt" />
          <FeInput name="query" label="Search" />
        </QuickForm>
        {searchState.loading && <Loading />}
        {searchState.error && <div>{searchState.error}</div>}
      </ContainerSection>
      <ContainerHeader>Response</ContainerHeader>
      <ContainerSection>
        <Text>{searchState.response}</Text>
      </ContainerSection>
      <ContainerHeader>Sources</ContainerHeader>
      {searchState.results.map((result) => (
        <SourchCollectionPartCard key={result.id}>{result}</SourchCollectionPartCard>
      ))}
    </>
  );
}

function SourchCollectionPartCard({ children }: { children: ClientSourcePart }) {
  return (
    <Card>
      <div>{children.content}</div>
    </Card>
  );
}

export function SourceCollectionChat({ params }) {
  const collection = useSourceCollection(params.id);
  if (collection.loading) {
    return <Loading> Fetching Source Collection</Loading>;
  }
  if (collection.value == null) {
    return <div>Source Collection not found</div>;
  }
  return (
    <Page label="Search">
      <Screen>{collection.value}</Screen>
    </Page>
  );
}
