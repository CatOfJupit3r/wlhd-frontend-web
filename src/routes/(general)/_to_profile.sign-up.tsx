import { createFileRoute } from '@tanstack/react-router';

import SignUpPage from '@pages/SignUpPage';

export const Route = createFileRoute('/(general)/_to_profile/sign-up')({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignUpPage />;
}
