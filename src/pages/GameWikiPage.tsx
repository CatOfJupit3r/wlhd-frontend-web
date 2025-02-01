import GameWiki from '@components/GameWiki/GameWiki';
import { GameWikiContextProvider } from '@context/GameWikiContext';

const GameWikiPage = () => {
    return (
        <GameWikiContextProvider>
            <GameWiki />
        </GameWikiContextProvider>
    );
};

export default GameWikiPage;
