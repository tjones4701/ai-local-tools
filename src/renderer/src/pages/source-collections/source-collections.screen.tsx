import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody } from '@fluentui/react-components';
import { rpcGeneric } from '../../lib/server';

const SourceCollectionsScreen: React.FC = () => {
  const [sourceCollections, setSourceCollections] = useState([]);

  useEffect(() => {
    const fetchSourceCollections = async () => {
      try {
        const data = await rpcGeneric('knowledge.getSourceCollections');
        setSourceCollections(data);
      } catch (error) {
        console.error('Error fetching source collections:', error);
      }
    };

    fetchSourceCollections();
  }, []);

  return (
    <div>
      {sourceCollections.map((collection) => (
        <Card key={collection.id}>
          <CardHeader>{collection.name}</CardHeader>
          <CardBody>{collection.description}</CardBody>
        </Card>
      ))}
    </div>
  );
};

export default SourceCollectionsScreen;
