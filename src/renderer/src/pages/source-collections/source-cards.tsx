import { makeStyles } from '@fluentui/react-components';
import { useSources } from '@renderer/lib/data/source.client';
import { SourceCard } from './source-card';

const useSourceCardStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }
});

export const SourceCards = ({
  collectionId,
  parentId = null
}: {
  collectionId: number;
  parentId?: number | null;
}) => {
  const { root } = useSourceCardStyles();
  const sourcesData = useSources({ collectionId: collectionId });
  const sources = (sourcesData.value ?? []).filter((source) => source.parent_source_id == parentId);

  if (sourcesData.loading) {
    return <div>Loading...</div>;
  }

  if (sources.length === 0) {
    return <div>No sources found</div>;
  }
  return (
    <div className={root}>
      {sources.map((card) => {
        return <SourceCard key={card.id}>{card}</SourceCard>;
      })}
    </div>
  );
};
