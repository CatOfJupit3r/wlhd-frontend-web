import { lazy, Suspense } from 'react';

// https://tanstack.com/router/latest/docs/framework/react/devtools
const TanStackRouterDevtools =
    // process.env.NODE_ENV === 'production'
    import.meta.env.PROD
        ? () => null // Render nothing in production
        : lazy(() =>
              // Lazy load in development
              import('@tanstack/router-devtools').then((res) => ({
                  default: res.TanStackRouterDevtools,
                  // For Embedded Mode
                  // default: res.TanStackRouterDevtoolsPanel
              })),
          );

export default () => (
    <Suspense>
        <TanStackRouterDevtools />
    </Suspense>
);
