import MyProfilePage from '@pages/MyProfilePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/profile/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <MyProfilePage />;
}
