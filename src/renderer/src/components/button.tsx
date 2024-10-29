import { Button as FluentButton, GriffelStyle, makeStyles, Text } from '@fluentui/react-components';
import { isString } from '@renderer/lib/is-string';
import * as React from 'react';
import Icon from './icon';
import Loading from './loading';
import Tooltip from './tooltip';

export type ButtonSize = 'default' | 'small' | 'large' | 'mini' | 'compact';
export type ButtonType =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'primary-outline'
  | 'secondary-outline';
type IButton = {
  buttonType?: 'submit';
  type?: ButtonType;
  newTab?: boolean;
  children?: any;
  className?: string;
  size?: ButtonSize;
  onClick?: (e: any) => void;
  styleProps?: GriffelStyle;
  href?: string;
  queryHref?: { [key: string]: any };
  disabled?: boolean;
  isLoading?: boolean;
  displayInline?: boolean;
  tooltip?: string;
  fullWidth?: boolean;
  icon?: React.ReactElement | string;
  fullHeight?: boolean;
  textSize?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  iconSize?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
};

const appearances: Record<
  ButtonType,
  'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent'
> = {
  primary: 'outline',
  secondary: 'secondary',
  ghost: 'transparent',
  'primary-outline': 'outline',
  'secondary-outline': 'outline'
};

const sizes: Record<ButtonSize, any> = {
  mini: 'small',
  default: 'medium',
  compact: 'small',
  large: 'large',
  small: 'small'
};

const useStyles = makeStyles({
  aClassName: {
    display: 'inline-block'
  }
});

const Button: React.FC<IButton> = function ({
  tooltip,
  size,
  type,
  children,
  onClick,
  href,
  newTab,
  buttonType,
  disabled,
  isLoading,
  icon,
  iconSize,
  textSize
}: IButton) {
  const { aClassName } = useStyles();
  type = type ?? 'primary';
  size = size ?? 'default';
  if (isLoading) {
    children = <Loading />;
    disabled = true;
  }

  let iconElement = icon;
  const iconStyle = { marginBottom: '0px' };
  if (size == 'compact' || size == 'mini') {
    iconStyle.marginBottom = '-2px';
  }
  if (isString(iconElement)) {
    iconElement = (
      <Text size={iconSize ?? textSize}>
        <Icon style={iconStyle}>{icon?.toString()}</Icon>
      </Text>
    );
  }

  let inner = (
    <FluentButton
      disabled={disabled}
      type={buttonType}
      onClick={onClick}
      appearance={appearances?.[type] ?? 'outline'}
      icon={iconElement}
      size={sizes?.[size] ?? ('default' as any)}
    >
      <Text size={textSize}>{children}</Text>
    </FluentButton>
  );

  if (href != null) {
    inner = (
      <a href={href} className={aClassName} target={newTab ? '_blank' : ''} rel="noreferrer">
        {inner}
      </a>
    );
  }

  if (tooltip == null) {
    return inner;
  } else {
    return <Tooltip tooltip={tooltip}>{inner}</Tooltip>;
  }
};

export default Button;
