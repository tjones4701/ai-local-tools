import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PodcastScreen } from './pages/podcast/podcast.screen';
import { HomeScreen } from './pages/home/home.screen';
import { Navigation } from './components/navigation';
import { makeStyles } from '@fluentui/react-components';
import { SettingsScreen } from './pages/settings/settings.screen';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100vw',
    minHeight: '100vh'
  },
  inner: {
    paddingTop: '10px',
    paddingLeft: '20px',
    paddingRight: '20px',
    borderTop: '1px solid #e0e0e0'
  }
});

export const appRoutes = [
  {
    label: 'Home',
    href: '/',
    element: HomeScreen
  },
  {
    label: 'Podcast',
    href: '/podcast',
    element: PodcastScreen
  },
  {
    label: 'Settings',
    href: '/settings',
    element: SettingsScreen
  }
];

export function AppRouter(): JSX.Element {
  const { root, inner } = useStyles();
  return (
    <div className={root}>
      <Navigation />
      <div className={inner}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              {appRoutes.map((route) => {
                const Element = route.element;
                if (route.href === '/') {
                  return <Route key={route.href} index element={<HomeScreen />} />;
                }
                return <Route path={route.href} key={route.href} element={<Element />} />;
              })}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
