import { makeStyles } from '@fluentui/react-components';
import { isValidElement } from 'react';
import { BrowserRouter, RouteObject, useParams, useRoutes } from 'react-router-dom';
import { Navigation } from './components/navigation';
import { HomeScreen } from './pages/home/home.screen';
import { PodcastScreen } from './pages/podcast/podcast.screen';
import { SettingsScreen } from './pages/settings/settings.screen';
import { SourceCollectionView } from './pages/source-collections/source-collection-view';
import SourceCollectionsScreen from './pages/source-collections/source-collections.screen';
import { SourceView } from './pages/sources/source.screen';
import { SourceCollectionSearchScreen } from './pages/source-collections/source-collection-search.screen';

export type RouteElementProps = {
  params: { [key: string]: string };
};

export type RouteElement = React.FC<RouteElementProps>;

const useStyles = makeStyles({
  inner: {
    borderTop: '1px solid #e0e0e0',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 50px)',
    height: '100vh'
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
  },
  {
    label: 'Source Collections',
    href: '/source-collections',
    children: [
      {
        label: 'View',
        href: '/',
        element: SourceCollectionsScreen
      },
      {
        label: 'Search',
        href: '/source-collections/:id/search',
        element: SourceCollectionSearchScreen
      },
      {
        label: 'New',
        href: ':id',
        element: SourceCollectionView
      }
    ]
  },
  {
    href: '/sources',
    children: [
      {
        label: 'New',
        href: ':id',
        element: SourceView
      }
    ]
  }
];

function RouteWrapper({ children }: any) {
  const ChildElement = children;
  let params = useParams();

  return <ChildElement params={params} />;
}

function renderRouteElement(Element: any) {
  if (Element != null && !isValidElement(Element)) {
    Element = <RouteWrapper>{Element}</RouteWrapper>;
  }

  return Element;
}

function mapRoutes(routes): RouteObject[] {
  return routes.map((route) => {
    const isIndex = route.href == '/';
    return {
      index: route.href == '/',
      path: !isIndex ? route.href : undefined,
      element: renderRouteElement(route.element),
      children: route.children ? mapRoutes(route.children) : undefined
    };
  });
}

function AppRouterInner(): JSX.Element {
  const routes = mapRoutes(appRoutes);
  let element = useRoutes(routes);
  return <>{element}</>;
}

export function AppRouter(): JSX.Element {
  const { inner } = useStyles();
  return (
    <div>
      <Navigation />
      <div className={inner}>
        <BrowserRouter>
          <AppRouterInner />
        </BrowserRouter>
      </div>
    </div>
  );
}
