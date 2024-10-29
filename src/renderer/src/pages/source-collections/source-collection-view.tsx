import { makeStyles } from '@fluentui/react-components';
import { RouteElement } from '@renderer/app-router';
import ContainerHeader from '@renderer/components/container/ContainerHeader';
import ContainerSection from '@renderer/components/container/ContainerSection';
import Detail from '@renderer/components/detail';
import { Page } from '@renderer/components/page';
import {
  ClientSourceCollection,
  useSourceCollection
} from '@renderer/lib/data/source-collection.client';
import { useSources } from '@renderer/lib/data/source.client';
import FEInput from '@renderer/quick-form/inputs/fe-input';
import QuickForm from '@renderer/quick-form/QuickForm';
import { SourceCard } from './source-card';

export const SourceCollectionView: RouteElement = ({ params }) => {
  const collectionData = useSourceCollection(params?.id);

  const collection = collectionData?.value;

  if (collection == null) {
    return <div>Collection not found</div>;
  }

  let title = collection.name ?? '';
  if (collectionData.loading) {
    title = 'Loading...';
  }

  const handleSubmit = async (newValue: ClientSourceCollection) => {
    await collectionData.update(newValue);
    collectionData.fetch();
  };

  return (
    <Page
      containerise
      label={title}
      breadcrumbs={[{ href: '/source-collections', label: 'Source Collections' }]}
    >
      <ContainerSection>
        <QuickForm
          disabled={collectionData.loading}
          onSubmit={handleSubmit}
          defaultValues={collection}
        >
          <FEInput required label="Name" name="name" />
          <FEInput label="Description" name="description" />
          <Detail label="Last Modified" type="date">
            {collection.modified_at}
          </Detail>
        </QuickForm>
      </ContainerSection>
      <ContainerHeader>Sources</ContainerHeader>
      <ContainerSection>
        <SourceCards>{collection.id}</SourceCards>
      </ContainerSection>
    </Page>
  );
};

const useSourceCardStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }
});
const SourceCards = ({ children }: { children: number }) => {
  const { root } = useSourceCardStyles();
  const sourcesData = useSources({ collectionId: children });
  const sources = sourcesData.value ?? [];

  if (sourcesData.loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className={root}>
      {sources.map((card) => {
        return <SourceCard key={card.id}>{card}</SourceCard>;
      })}
    </div>
  );
};