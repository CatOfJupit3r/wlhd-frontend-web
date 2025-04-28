import { useNoFooterOrHeader } from '@context/LayoutContext';
import { createFileRoute } from '@tanstack/react-router';

import GameTestPage from '@pages/game-test-page';

export const Route = createFileRoute('/_auth_only/game-test')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();

    return <GameTestPage />;
}
