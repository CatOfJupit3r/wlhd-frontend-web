import { createFileRoute } from '@tanstack/react-router';

import CreateCharacterPage from '@pages/CreateCharacterPage';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/create-character')({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateCharacterPage />;
}
