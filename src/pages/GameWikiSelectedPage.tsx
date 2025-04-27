import { SupportedDLCs } from 'config';
import { FC } from 'react';

import DLCContents from '@components/GameWiki/DLCContents';

interface GameWikiChoicePageProps {
    dlc: SupportedDLCs;
}

const GameWikiChoicePage: FC<GameWikiChoicePageProps> = ({ dlc }) => {
    return <DLCContents dlc={dlc} />;
};

export default GameWikiChoicePage;
