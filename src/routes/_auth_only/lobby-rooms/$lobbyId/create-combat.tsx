import { useNoFooterOrHeader } from '@context/LayoutContext';
import { createFileRoute } from '@tanstack/react-router';

import CreateCombatPage from '@pages/create-combat-page';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/create-combat')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();

    return <CreateCombatPage />;
}
