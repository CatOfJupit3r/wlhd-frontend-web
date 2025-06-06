import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

import PseudoPage from '@pages/pseudo-page';
import { useMe } from '@queries/use-me';

export const Route = createFileRoute('/_auth_only')({
    beforeLoad: async ({ context }) => {
        await context.me;
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { isLoggedIn, isLoading } = useMe();

    if (isLoading) {
        return <PseudoPage />;
    }

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />;
    }

    return <Outlet />;
}
