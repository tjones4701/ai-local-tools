import { makeStyles } from '@fluentui/react-components';
import { forceArray } from '@renderer/lib/force-array';
import React from 'react';

interface ISpaceApart {
  children: any;
  noWrap?: boolean;
  verticle?: boolean;
  horizontal?: boolean;
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  verticle: {
    alignItems: 'center'
  },
  horizontal: {
    justifyContent: 'space-between'
  },
  wrap: {
    flexWrap: 'wrap'
  }
});
const SpaceApart: React.FC<ISpaceApart> = function ({
  children,
  noWrap,
  verticle = undefined,
  horizontal = undefined
}: ISpaceApart) {
  const styles = useStyles();

  const classNames = [styles.root];
  if (verticle) {
    classNames.push(styles.verticle);
  }
  if (horizontal) {
    classNames.push(styles.horizontal);
  }
  if (noWrap) {
    classNames.push(styles.wrap);
  }

  if (verticle == null && horizontal == null) {
    verticle = true;
    horizontal = true;
  }

  const elements = forceArray(children);
  return <div className={classNames.join(' ')}>{elements}</div>;
};

export default SpaceApart;
