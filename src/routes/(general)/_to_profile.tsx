import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';

import { useNoFooterOrHeader } from '@context/LayoutContext';
import PseudoPage from '@pages/pseudo-page';
import { useMe } from '@queries/use-me';

export const Route = createFileRoute('/(general)/_to_profile')({
    beforeLoad: async ({ context }) => {
        await context.me;
    },
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();
    const { isLoggedIn, isLoading } = useMe();

    if (isLoading) {
        return <PseudoPage />;
    }

    if (isLoggedIn) {
        return <Navigate to={'/profile'} />;
    }

    return <Outlet />;
}
