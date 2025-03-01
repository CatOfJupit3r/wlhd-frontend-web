import ViewCharacterPage from '@pages/ViewCharacterPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/view-character')({
    component: RouteComponent,
    validateSearch: async ({ character }) => {
        if (!character) {
            return {
                character: null,
            };
        }
        return {
            character,
        } as { character: string };
    },
});

function RouteComponent() {
    const { character } = Route.useParams();

    return <ViewCharacterPage initial={character} />;
}
