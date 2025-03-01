import TanStackRouterDevtools from '@components/devtools/tanstack-router-devtools';
import LayoutManager from '@components/layout-manager';
import useIsBackendUnavailable from '@hooks/useIsBackendUnavailable';
import PseudoPage from '@pages/PseudoPage';
import UnderMaintenanceNoDepsPage from '@pages/UnderMaintenanceNoDepsPage';
import { UseMe } from '@queries/useMe';
import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';

interface RootRouteContext {
    me: Promise<UseMe>;
    queryClient: typeof QueryClient;
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
