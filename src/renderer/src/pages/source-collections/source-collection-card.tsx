import {
  Caption1,
  Card,
  CardHeader,
  makeStyles,
  mergeClasses,
  Text,
  tokens
} from '@fluentui/react-components';
import Button from '@renderer/components/button';
import { ClientSourceCollection } from '@renderer/lib/data/source-collection.client';

const useStyles = makeStyles({
  card: {
    width: '300px',
    maxWidth: '100%',
    height: 'fit-content'
  },

  flex: {
    gap: '4px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },

  caption: {
    color: tokens.colorNeutralForeground3
  },

  cardFooter: {
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

export const SourceCollectionCard = ({ children }: { children: ClientSourceCollection }) => {
  const { card, caption, cardFooter, flex } = useStyles();

  return (
    <Card className={card}>
      <CardHeader
        header={<Text weight="semibold">{children.name}</Text>}
        description={<Caption1 className={caption}>{children.description}</Caption1>}
      />

      <footer className={mergeClasses(flex, cardFooter)}>
        <Button href={`/source-collections/${children.id}`}>View</Button>
        <Button href={`/source-collections/${children.id}/search`}>Search</Button>
        <Button href={`/source-collections/${children.id}/chat`}>Chat</Button>
      </footer>
    </Card>
  );
};
