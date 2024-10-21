import { Card, CardHeader, CardPreview } from '@fluentui/react-components';
import { useSourceCollections } from '@renderer/lib/data/source-collection.client';
import React from 'react';

const SourceCollectionsScreen: React.FC = () => {
  const sourceCollections = useSourceCollections();

  if (sourceCollections.loading) {
    return <div>Loading...</div>;
  }
  if (sourceCollections.error) {
    return <div>Error: {sourceCollections.error.message}</div>;
  }
  const items = sourceCollections?.value ?? [];

  return (
    <div>
      {items.map((collection) => (
        <Card key={collection.id}>
          <CardHeader>{collection.name}</CardHeader>
          <CardPreview>{collection.description}</CardPreview>
        </Card>
      ))}
    </div>
  );
};

export default SourceCollectionsScreen;
