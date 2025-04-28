import { createFileRoute } from '@tanstack/react-router';

import AboutPage from '@pages/about-page';

export const Route = createFileRoute('/(general)/about')({
    component: RouteComponent,
});

function RouteComponent() {
    return <AboutPage />;
}
