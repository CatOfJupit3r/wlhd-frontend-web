import ViewCharacterPage from '@pages/ViewCharacterPage';
import { createFileRoute } from '@tanstack/react-router';

interface ViewCharacterSearch {
    character: string | null;
}

export const Route = createFileRoute('/_auth_only/lobby-rooms/$lobbyId/view-character')({
    component: RouteComponent,
    validateSearch: ({ character }): ViewCharacterSearch => {
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
    const { character } = Route.useSearch();

    return <ViewCharacterPage initial={character} />;
}
