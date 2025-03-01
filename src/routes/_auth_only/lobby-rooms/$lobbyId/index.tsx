import LobbyPage from '@pages/LobbyPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <LobbyPage />;
}
