import PseudoPage from '@pages/PseudoPage';
import { useMe } from '@queries/useMe';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

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
