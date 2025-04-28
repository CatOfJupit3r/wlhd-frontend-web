import { createFileRoute } from '@tanstack/react-router';

import LobbyPage from '@pages/lobby-page';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <LobbyPage />;
}
