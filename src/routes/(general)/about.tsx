import { createFileRoute } from '@tanstack/react-router';

import AboutPage from '@pages/AboutPage';

export const Route = createFileRoute('/(general)/about')({
    component: RouteComponent,
});

function RouteComponent() {
    return <AboutPage />;
}
