import React from 'react';
import {
  Tooltip as FluentTooltip,
  OnVisibleChangeData,
  PositioningShorthand
} from '@fluentui/react-components';

export type TooltipPlacements = PositioningShorthand;

export type ITooltip = {
  children?: any;
  tooltip?: string | any;
  onOpen?: any;
  placement?: TooltipPlacements;
};

const Tooltip: React.FC<ITooltip> = function ({ children, tooltip, onOpen, placement }: ITooltip) {
  if (tooltip == null) {
    return <>{children}</>;
  }
  const onVisibleChange = (_event: any, data: OnVisibleChangeData) => {
    if (data.visible) {
      if (onOpen != null) {
        onOpen();
      }
    }
  };
  return (
    <FluentTooltip
      content={tooltip}
      relationship="label"
      positioning={placement}
      onVisibleChange={onVisibleChange}
    >
      {children}
    </FluentTooltip>
  );
};

export default Tooltip;
