import React from 'react';
import ContainerSection from './ContainerSection';
import { makeStyles } from '@fluentui/react-components';
import { Theme } from '@renderer/theme';

export interface IContainerHeader {
  children?: React.ReactNode;
  level?: number;
}

const useStyles = makeStyles({
  containerHeader: {
    padding: Theme.sizing.small,
    paddingBottom: Theme.sizing.xSmall,
    paddingTop: Theme.sizing.xSmall,
    ...Theme.borders.bottom(Theme.borders.border300),
    ...Theme.typography.HeadingXSmall
  }
});

const ContainerHeader: React.FC<IContainerHeader> = ({ children, level }: IContainerHeader) => {
  const { containerHeader } = useStyles();
  let role: string | undefined = undefined;
  if (level != null) {
    role = 'heading';
  }
  return (
    <ContainerSection className={containerHeader} role={role} ariaLevel={level}>
      {children}
    </ContainerSection>
  );
};

export default ContainerHeader;
