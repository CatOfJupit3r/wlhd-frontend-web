import { TooltipProvider } from '@components/ui/tooltip';
import NotFoundPage from '@pages/NotFoundPage';
import PseudoPage from '@pages/PseudoPage';
import QueryClient from '@queries/QueryClient';
import { useMe, UseMe } from '@queries/useMe';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { routeTree } from './routeTree.gen';

const mePromise = Promise.withResolvers<UseMe>();

const router = createRouter({
    routeTree,
    defaultPendingComponent: PseudoPage,
    context: {
        // it is okay here, cuz it will be passed later
        me: undefined!,
        queryClient: undefined!,
    },
    defaultNotFoundComponent: NotFoundPage,
});

const MeResolver = () => {
    const me = useMe();

    useEffect(() => {
        if (me.isLoading) return;
        mePromise.resolve(me);
    }, [me, me.isLoading]);

    return null;
};

const App = () => {
    return (
        <QueryClientProvider client={QueryClient}>
            <MeResolver />
            <ReactQueryDevtools />
            <TooltipProvider>
                <div className={'App'}>
                    <RouterProvider router={router} context={{ me: mePromise.promise, queryClient: QueryClient }} />
                </div>
            </TooltipProvider>
            <ToastContainer />
        </QueryClientProvider>
    );
};

export default App;
