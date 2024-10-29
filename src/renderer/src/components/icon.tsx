import React from 'react';
import * as icons from 'react-icons/bi';

export type AlertVariants = 'info' | 'warning' | 'danger' | 'error';
export interface IIcon {
  className?: string;
  children?: string;
  rotation?: number;
  style?: any;
  center?: boolean;
}

const Icon: React.FC<IIcon> = ({ children, className, rotation, style, center }: IIcon) => {
  if (children == null) {
    return <></>;
  }
  if (children.startsWith('Bi')) {
    children = children.substring(2);
  }
  const IconComponent = icons[`Bi${children}`];
  if (IconComponent == null) {
    return <>{`[${children}]`}</>;
  }
  style = { ...(style ?? {}) };

  if (center) {
    style.display = 'flex';
    style.alignItems = 'center';
  }
  if (rotation != null) {
    style.transform = `rotate(${rotation}deg)`;
  }
  return <IconComponent style={style} className={className ?? ''} />;
};

export default Icon;
