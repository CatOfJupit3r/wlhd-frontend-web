import { useNoFooterOrHeader } from '@context/LayoutContext';
import CreateCombatPage from '@pages/CreateCombatPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/create-combat')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();

    return <CreateCombatPage />;
}
