import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, ErrorComponent, RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import { TooltipProvider } from '@components/ui/tooltip';
import QueryClient from '@constants/query-client';
import NotFoundPage from '@pages/not-found-page';
import PseudoPage from '@pages/pseudo-page';
import { useMe, UseMe } from '@queries/use-me';

import { routeTree } from './routeTree.gen';

const mePromise = Promise.withResolvers<UseMe>();

const router = createRouter({
    routeTree,

    defaultPendingComponent: PseudoPage,
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,

    context: {
        // it is okay here, cuz it will be passed later
        me: undefined!,
        queryClient: undefined!,
    },

    scrollRestoration: true,
    defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const MeResolver = () => {
    const me = useMe();

    useEffect(() => {
        if (me.isLoading) return;
        mePromise.resolve(me);
    }, [me, me.isLoading]);

    return null;
};

const Main = () => {
    return (
        <QueryClientProvider client={QueryClient}>
            <MeResolver />
            <ReactQueryDevtools />
            <TooltipProvider>
                <div className={'text-center'}>
                    <RouterProvider router={router} context={{ me: mePromise.promise, queryClient: QueryClient }} />
                </div>
            </TooltipProvider>
            <ToastContainer />
        </QueryClientProvider>
    );
};

export default Main;
