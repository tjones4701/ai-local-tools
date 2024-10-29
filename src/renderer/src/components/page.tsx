import { Breadcrumb, BreadcrumbItem, Link, makeStyles } from '@fluentui/react-components';
import Container from './container/Container';

type paddingTypes = false | 'horizontal' | 'vertical' | 'default';
export type PageProps = {
  children: any;
  label: string;
  breadcrumbs?: { href: string; label: string }[];
  padding?: paddingTypes;
  containerise?: boolean;
};

const useStyles = makeStyles({
  titleClassName: {
    width: '100%',
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    paddingBottom: '20px'
  },
  breadcrumbClassName: {
    paddingBottom: '10px'
  },
  defaultPadding: {
    paddingTop: '20px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingBottom: '20px'
  },
  horizontalPadding: {
    paddingLeft: '20px',
    paddingRight: '20px'
  },
  verticalPadding: {
    paddingTop: '20px',
    paddingBottom: '20px'
  }
});

export function Page({ children, label, breadcrumbs, padding }: PageProps) {
  const styles = useStyles();
  const { titleClassName, defaultPadding, breadcrumbClassName } = styles;

  let paddingClassName = defaultPadding;
  padding = padding ?? 'default';
  if (padding !== false) {
    paddingClassName = styles[`${padding}Padding`] ?? styles.defaultPadding;
  } else {
    paddingClassName = '';
  }
  return (
    <div>
      <div className={`${titleClassName} ${paddingClassName}`}>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb className={breadcrumbClassName}>
            {breadcrumbs.map((breadcrumb) => (
              <BreadcrumbItem key={breadcrumb.href}>
                <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
              </BreadcrumbItem>
            ))}
          </Breadcrumb>
        )}
        <h1>{label}</h1>
      </div>
      <Container>{children}</Container>
    </div>
  );
}
