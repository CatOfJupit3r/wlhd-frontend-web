import { createFileRoute } from '@tanstack/react-router';

import UserSettingsPage from '@pages/user-settings-page';

export const Route = createFileRoute('/_auth_only/profile/settings')({
    component: RouteComponent,
});

function RouteComponent() {
    return <UserSettingsPage />;
}
