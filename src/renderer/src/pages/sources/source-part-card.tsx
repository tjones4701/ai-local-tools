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
import { ClientSourcePart } from '@renderer/lib/data/source-part.client';

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

export const SourcePartCard = ({ children }: { children: ClientSourcePart }) => {
  const { card, caption, cardFooter, flex } = useStyles();

  return (
    <Card className={card}>
      <CardHeader
        header={<Text weight="semibold">{children.id}</Text>}
        description={<Caption1 className={caption}>{children.summary}</Caption1>}
      />

      <footer className={mergeClasses(flex, cardFooter)}>
        <Button href={`/source-parts/${children.id}`}>View</Button>
      </footer>
    </Card>
  );
};
