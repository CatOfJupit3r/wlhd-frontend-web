import { createFileRoute } from '@tanstack/react-router';

import HomePage from '@pages/home-page';

export const Route = createFileRoute('/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <HomePage />;
}
