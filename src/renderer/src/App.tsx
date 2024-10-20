import { FluentProvider, webLightTheme, webDarkTheme } from '@fluentui/react-components';
import { AppRouter } from './app-router';
import { DataProvider } from './hooks/save-data';
import { useSettings } from './hooks/use-settings';
import { useEffect } from 'react';
import { rpcGeneric } from './lib/server';
import { useDebounce } from 'react-use';

function ThemeWrapper({ children }: { children: JSX.Element }): JSX.Element {
  const theme = useSettings('PREFERENCES', 'theme', 'light');
  if (theme.isLoading) {
    return <></>;
  }
  const currentTheme = theme.value === 'light' ? webLightTheme : webDarkTheme;
  return <FluentProvider theme={currentTheme}>{children}</FluentProvider>;
}

function App(): JSX.Element {
  useDebounce(
    () => {
      rpcGeneric('knowledge.test');
    },
    100,
    ['test']
  );
  return (
    <DataProvider>
      <ThemeWrapper>
        <AppRouter />
      </ThemeWrapper>
    </DataProvider>
  );
}

export default App;
