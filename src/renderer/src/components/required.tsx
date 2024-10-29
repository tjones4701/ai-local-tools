import { makeStyles } from '@fluentui/react-components';
import React from 'react';

interface IRequired {
  className?: string;
}
const useStyles = makeStyles({
  root: {
    color: 'red',
    paddingLeft: '0.2em',
    fontWeight: 'bold'
  }
});

const Required: React.FC<IRequired> = ({ className }: IRequired) => {
  const { root } = useStyles();
  className = `${className ?? ''} ${root}`;
  return <span className={className}>*</span>;
};

export default Required;
