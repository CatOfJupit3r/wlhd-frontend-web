import CreateCharacterPage from '@pages/CreateCharacterPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/create-character')({
    component: RouteComponent,
});

function RouteComponent() {
    return <CreateCharacterPage />;
}
