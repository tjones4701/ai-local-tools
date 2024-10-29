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
import { ClientSource, processSource } from '@renderer/lib/data/source.client';
import { useState } from 'react';

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

export const SourceCard = ({ children }: { children: ClientSource }) => {
  const { card, caption, cardFooter, flex } = useStyles();
  const [isProcessing, setIsProcessing] = useState(false);

  const process = async () => {
    setIsProcessing(true);
    await processSource(children.id);
    setIsProcessing(false);
  };

  return (
    <Card className={card}>
      <CardHeader
        header={<Text weight="semibold">{children.name}</Text>}
        description={<Caption1 className={caption}>{children.description}</Caption1>}
      />

      <footer className={mergeClasses(flex, cardFooter)}>
        <Button href={`/sources/${children.id}`}>View</Button>
        <Button onClick={process} disabled={isProcessing}>
          Process
        </Button>
      </footer>
    </Card>
  );
};
