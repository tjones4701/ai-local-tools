import { useSourceCollections } from '@renderer/lib/data/source-collection.client';
import React from 'react';
import { SourceCollectionCard } from './source-collection-card';
import { Page } from '@renderer/components/page';
import { makeStyles } from '@fluentui/react-components';
import ContainerSection from '@renderer/components/container/ContainerSection';

const useStyles = makeStyles({
  cardsContainerClassName: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }
});

const SourceCollectionsScreen: React.FC = () => {
  const { cardsContainerClassName } = useStyles();
  const sourceCollections = useSourceCollections();

  if (sourceCollections.loading) {
    return <div>Loading...</div>;
  }
  if (sourceCollections.error) {
    return <div>Error: {sourceCollections.error.message}</div>;
  }
  const items = sourceCollections?.value ?? [];

  return (
    <Page label="Source Collections">
      <ContainerSection>
        <div className={cardsContainerClassName}>
          {items.map((collection) => (
            <SourceCollectionCard key={collection.id}>{collection}</SourceCollectionCard>
          ))}
        </div>
      </ContainerSection>
    </Page>
  );
};

export default SourceCollectionsScreen;
