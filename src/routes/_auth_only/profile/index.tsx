import { createFileRoute } from '@tanstack/react-router';

import MyProfilePage from '@pages/MyProfilePage';

export const Route = createFileRoute('/_auth_only/profile/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <MyProfilePage />;
}
