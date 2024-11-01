import { makeStyles } from '@fluentui/react-components';
import { SourcePartCard } from './source-part-card';
import { useSourceParts } from '@renderer/lib/data/source-part.client';

const useSourcePartCardStyles = makeStyles({
  root: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  }
});

export const SourcePartCards = ({ sourceId }: { sourceId: number }) => {
  const { root } = useSourcePartCardStyles();
  const sourcePartsData = useSourceParts({ sourceId: sourceId });
  const sourceParts = (sourcePartsData.value ?? []).filter((part) => part.source_id == sourceId);

  if (sourcePartsData.loading) {
    return <div>Loading...</div>;
  }

  if (sourceParts.length === 0) {
    return <div>No source parts found</div>;
  }
  return (
    <div className={root}>
      {sourceParts.map((part) => {
        return <SourcePartCard key={part.id}>{part}</SourcePartCard>;
      })}
    </div>
  );
};
