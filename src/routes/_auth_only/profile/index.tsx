import { createFileRoute } from '@tanstack/react-router';

import MyProfile from '@pages/my-profile';

export const Route = createFileRoute('/_auth_only/profile/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <MyProfile />;
}
