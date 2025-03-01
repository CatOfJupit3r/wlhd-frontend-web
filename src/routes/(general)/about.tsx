import AboutPage from '@pages/AboutPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(general)/about')({
    component: RouteComponent,
});

function RouteComponent() {
    return <AboutPage />;
}
