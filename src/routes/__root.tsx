import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

import TanStackRouterDevtools from '@components/devtools/tanstack-router-devtools';
import LayoutManager from '@components/layout-manager';
import useIsBackendUnavailable from '@hooks/use-is-backend-unavailable';
import PseudoPage from '@pages/pseudo-page';
import UnderMaintenanceNoDepsPage from '@pages/under-maintenance-no-deps-page';
import { UseMe } from '@queries/use-me';

export interface RootRouteContext {
    me: Promise<UseMe>;
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
    component: RootComponent,
});

function RootComponent() {
    const { isBackendUnavailable } = useIsBackendUnavailable();

    return (
        <>
            <TanStackRouterDevtools />
            {isBackendUnavailable === null ? ( // means that we haven't checked backend availability yet
                <PseudoPage />
            ) : isBackendUnavailable ? ( // means that backend is unavailable
                <UnderMaintenanceNoDepsPage />
            ) : (
                // else, means that backend is available
                <LayoutManager>
                    <Outlet />
                </LayoutManager>
            )}
        </>
    );
}
