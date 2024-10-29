const spacer = 8;

const borderHelper = (size: number, color: string) => {
  return {
    borderTop: `${size}px solid ${color}`,
    borderLeft: `${size}px solid ${color}`,
    borderRight: `${size}px solid ${color}`,
    borderBottom: `${size}px solid ${color}`
  };
};
export const Theme = {
  sizing: {
    xxSmall: `${spacer / 2}px`,
    xSmall: `${spacer * 1}px`,
    small: `${spacer * 2}px`,
    medium: `${spacer * 3}px`,
    large: `${spacer * 4}px`,
    xLarge: `48px`,
    xxLarge: `64px`,
    spacer: spacer
  },
  typography: {
    HeadingXSmall: {
      fontSize: '1rem',
      fontWeight: 600
    }
  },

  baseAppFontSize: '12px',
  fontSizes: {
    default: 'medium',
    fontSizeXXSmall: 'xx-small',
    fontSizeXSmall: 'x-small',
    fontSizeSmall: 'small',
    fontSizeMedium: 'medium',
    fontSizeLarge: 'large',
    fontSizeXLarge: 'x-large',
    fontSizeXXLarge: 'xx-large'
  },
  sizingRaw: {
    xSmall: spacer * 1,
    small: spacer * 2,
    medium: spacer * 3,
    large: spacer * 4,
    xLarge: 48,
    xxLarge: 64,
    spacer: spacer,
    pageSidePadding: '4vw',
    pageTopPadding: 'clamp(20px,5vh, 40px)'
  },
  zIndex: {
    NAVIGATION: 999,
    MODAL: 1000000,
    POPOVER: 1000001
  },
  editor: {
    colors: {
      grey: '#F6F8FA'
    }
  },
  colors: {
    whiteish: 'rgba(255,255,255,0.8)',
    blackish: 'rgba(0,0,0,0.9)'
  },
  borders: {
    border: borderHelper,
    bottom: (props: any) => {
      delete props.borderTop;
      delete props.borderLeft;
      delete props.borderRight;
      return props;
    },
    border300: {
      ...borderHelper(1, 'rgba(0,0,0,0.1)')
    }
  }
};
