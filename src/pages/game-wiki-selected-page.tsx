import { FC } from 'react';

import DLCContents from '@components/GameWiki/DLCContents';
import { SupportedDLCs } from '@constants/game-support';

interface GameWikiChoicePageProps {
    dlc: SupportedDLCs;
}

const GameWikiChoicePage: FC<GameWikiChoicePageProps> = ({ dlc }) => {
    return <DLCContents dlc={dlc} />;
};

export default GameWikiChoicePage;
