import { useNoFooterOrHeader } from '@context/LayoutContext';
import GameRoomPage from '@pages/GameRoomPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();
    const { lobbyId, gameId } = Route.useParams();

    return <GameRoomPage lobbyId={lobbyId} gameId={gameId} />;
}
