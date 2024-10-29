import React from 'react';
import { useToggle } from 'react-use';
import ContainerSection from './ContainerSection';
import { Link } from '@fluentui/react-components';
import ContainerHeader from './ContainerHeader';

export interface IContainerHeader {
  children?: React.ReactNode;
  title?: string;
  expanded?: boolean;
  level?: number;
  id?: string;
}

const ContainerAccordion: React.FC<IContainerHeader> = ({
  children,
  title,
  level,
  id
}: IContainerHeader) => {
  const [isExpanded, toggleExpanded] = useToggle(false);
  return (
    <>
      <Link href={`#${id ?? ''}`} onClick={toggleExpanded}>
        <ContainerHeader level={level}>{title}</ContainerHeader>
      </Link>
      {isExpanded && <ContainerSection>{children}</ContainerSection>}
    </>
  );
};

export default ContainerAccordion;
