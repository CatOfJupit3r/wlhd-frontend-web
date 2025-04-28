import { useNoFooterOrHeader } from '@context/LayoutContext';
import { createFileRoute } from '@tanstack/react-router';

import GameRoomPage from '@pages/game-room-page';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId')({
    component: RouteComponent,
});

function RouteComponent() {
    useNoFooterOrHeader();
    const { lobbyId, gameId } = Route.useParams();

    return <GameRoomPage lobbyId={lobbyId} gameId={gameId} />;
}
