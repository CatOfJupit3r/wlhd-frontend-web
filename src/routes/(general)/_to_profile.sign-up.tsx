import SignUpPage from '@pages/SignUpPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(general)/_to_profile/sign-up')({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignUpPage />;
}
