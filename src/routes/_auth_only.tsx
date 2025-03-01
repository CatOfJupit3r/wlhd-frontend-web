import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only')({
    beforeLoad: async ({ context }) => {
        const me = await context.me;

        if (!me.isLoggedIn) {
            redirect({
                to: '/login',
                throw: true,
            });
        }
    },
    component: () => <Outlet />,
});
