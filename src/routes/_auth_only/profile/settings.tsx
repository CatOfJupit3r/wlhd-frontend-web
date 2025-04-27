import UserSettingsPage from '@pages/user-settings-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/profile/settings')({
    component: RouteComponent,
});

function RouteComponent() {
    return <UserSettingsPage />;
}
