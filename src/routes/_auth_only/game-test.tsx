import { useNoFooterOrHeader } from '@context/LayoutContext';
import GameTestPage from '@pages/GameTestPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/game-test')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();

    return <GameTestPage />;
}
