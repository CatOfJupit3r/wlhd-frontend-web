import { createFileRoute } from '@tanstack/react-router';

import GameWikiChoicePage from '@pages/game-wiki-choice-page';

export const Route = createFileRoute('/_auth_only/game-wiki/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <GameWikiChoicePage />;
}
