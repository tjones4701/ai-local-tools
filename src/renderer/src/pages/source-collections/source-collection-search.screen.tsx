import { Card } from '@fluentui/react-components';
import ContainerSection from '@renderer/components/container/ContainerSection';
import Loading from '@renderer/components/loading';
import { Page } from '@renderer/components/page';
import {
  ClientSourceCollection,
  searchSourceCollection,
  useSourceCollection
} from '@renderer/lib/data/source-collection.client';
import { SourcePart } from '@renderer/lib/data/source-part.client';
import FeInput from '@renderer/quick-form/inputs/fe-input';
import QuickForm from '@renderer/quick-form/QuickForm';
import { useState } from 'react';

function Screen({ children }: { children: ClientSourceCollection }) {
  const [searchState, setSearchState] = useState<{
    loading: Boolean;
    results: any[];
    error: any;
  }>({
    loading: false,
    results: [],
    error: null
  });

  const handleSearch = async (data: any) => {
    setSearchState({ ...searchState, loading: true });
    const results = await searchSourceCollection(children.id, data.query);
    setSearchState({ ...searchState, loading: false, results });
  };

  return (
    <ContainerSection>
      <QuickForm onSubmit={handleSearch}>
        <FeInput name="query" label="Search" />
      </QuickForm>
      {searchState.loading && <Loading />}
      {searchState.error && <div>{searchState.error}</div>}
      {searchState.results.map((result) => (
        <SourchCollectionPartCard key={result.id}>{result}</SourchCollectionPartCard>
      ))}
    </ContainerSection>
  );
}

function SourchCollectionPartCard({ children }: { children: SourcePart }) {
  return (
    <Card>
      <div>{children.content}</div>
    </Card>
  );
}

export function SourceCollectionSearchScreen({ params }) {
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
