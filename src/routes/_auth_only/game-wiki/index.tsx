import { createFileRoute } from '@tanstack/react-router';

import GameWikiChoicePage from '@pages/game-wiki-choice-page';
import TranslationService from '@services/translation-service';

export const Route = createFileRoute('/_auth_only/game-wiki/')({
    component: RouteComponent,
    beforeLoad: async () => {
        await TranslationService.awaitTranslations();
    },
});

function RouteComponent() {
    return <GameWikiChoicePage />;
}
