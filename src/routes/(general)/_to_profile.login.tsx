import { createFileRoute } from '@tanstack/react-router';

import SignInPage from '@pages/sign-in-page';

export const Route = createFileRoute('/(general)/_to_profile/login')({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignInPage />;
}
