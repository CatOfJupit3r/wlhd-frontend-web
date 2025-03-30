import SignInPage from '@pages/SignInPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(general)/_to_profile/login')({
    component: RouteComponent,
});

function RouteComponent() {
    return <SignInPage />;
}
