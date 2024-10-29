import { makeStyles } from '@fluentui/react-components';
import { forceArray } from '@renderer/lib/force-array';
import React from 'react';

interface IAlignCenter {
  children: any;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

export const AlignRight: React.FC<IAlignCenter> = function ({ children }: IAlignCenter) {
  const { root } = useStyles();
  const elements = forceArray(children);
  return <div className={root}>{elements}</div>;
};
