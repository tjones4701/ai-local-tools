import type { ToolbarProps } from '@fluentui/react-components';
import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Toolbar,
  ToolbarButton,
  makeStyles
} from '@fluentui/react-components';
import { MoreHorizontal24Filled } from '@fluentui/react-icons';
import { appRoutes } from '@renderer/app-router';
import { useData } from '@renderer/hooks/save-data';
import * as React from 'react';

const useStyles = makeStyles({
  linkClassName: {
    textDecoration: 'none'
  }
});

export const ThemeMenuItem: React.FC = () => {
  const data = useData('preferences', {
    theme: 'light'
  });

  if (data.isLoading) {
    return null;
  }

  const theme = data.data.theme;

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    data.update({ theme: newTheme });
  };

  return <MenuItem onClick={toggleTheme}>Theme: {theme}</MenuItem>;
};

export const PreferencesMenu: React.FC = () => {
  return (
    <Menu>
      <MenuTrigger>
        <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />}>
          Preferences
        </ToolbarButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <ThemeMenuItem />
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};
export const Navigation: React.FC = (props: Partial<ToolbarProps>) => {
  const { linkClassName } = useStyles();
  const routeElements = appRoutes.map((route) => (
    <a className={linkClassName} href={route.href} key={route.href}>
      <MenuItem>{route.label}</MenuItem>
    </a>
  ));

  return (
    <Toolbar aria-label="Default" {...props}>
      <Menu>
        <MenuTrigger>
          <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />}>
            Pages
          </ToolbarButton>
        </MenuTrigger>
        <MenuPopover>
          <MenuList>{routeElements}</MenuList>
        </MenuPopover>
      </Menu>
      <PreferencesMenu />
    </Toolbar>
  );
};