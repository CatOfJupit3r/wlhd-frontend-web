import { createFileRoute, redirect } from '@tanstack/react-router';

import { SUPPORTED_DLCS_DESCRIPTORS } from '@constants/game-support';
import GameWikiSelectedPage from '@pages/game-wiki-selected-page';

export const Route = createFileRoute('/_auth_only/game-wiki/$dlc')({
    beforeLoad: async ({ params }) => {
        if (!SUPPORTED_DLCS_DESCRIPTORS.includes(params.dlc)) {
            redirect({
                to: '/game-wiki',
                throw: true,
            });
        }
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { dlc } = Route.useParams();

    return <GameWikiSelectedPage dlc={dlc} />;
}
