import GameWikiChoicePage from '@pages/GameWikiChoicePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_only/game-wiki/')({
    component: RouteComponent,
});

function RouteComponent() {
    return <GameWikiChoicePage />;
}
