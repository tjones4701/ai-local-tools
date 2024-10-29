import { makeStyles } from '@fluentui/react-components';
import { Theme } from '@renderer/theme';
import React from 'react';

export interface IContainer {
  id?: string;
  children?: React.ReactNode;
  className?: string;
}

const useStyles = makeStyles({
  container: {
    ...Theme.borders.border300
  }
});

const Container: React.FC<IContainer> = ({ children, id, className }: IContainer) => {
  const classes = useStyles();
  return (
    <div id={id} className={`${classes.container} ${className ?? ''}`}>
      {children}
    </div>
  );
};

export default Container;
