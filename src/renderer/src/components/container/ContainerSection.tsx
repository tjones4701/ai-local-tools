import { makeStyles } from '@fluentui/react-components';
import { Theme } from '@renderer/theme';
import React from 'react';

export interface IContainerSection {
  children?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  role?: string;
  ariaLevel?: number;
}

const useStyles = makeStyles({
  containerSection: {
    padding: Theme.sizing.small
  },
  containerSectionNoPadding: {
    padding: '0px'
  }
});

const ContainerSection: React.FC<IContainerSection> = ({
  children,
  noPadding,
  className,
  role,
  ariaLevel
}: IContainerSection) => {
  const { containerSection, containerSectionNoPadding } = useStyles();

  let stClassName = containerSection;
  if (noPadding) {
    stClassName = containerSectionNoPadding;
  }

  className = `${stClassName} ${className}`;

  return (
    <div role={role} className={className} aria-level={ariaLevel}>
      {children}
    </div>
  );
};

export default ContainerSection;
