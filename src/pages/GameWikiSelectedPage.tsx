import DLCContents from '@components/GameWiki/DLCContents';
import { SupportedDLCs } from 'config';
import { FC } from 'react';

interface GameWikiChoicePageProps {
    dlc: SupportedDLCs;
}

const GameWikiChoicePage: FC<GameWikiChoicePageProps> = ({ dlc }) => {
    return <DLCContents dlc={dlc} />;
};

export default GameWikiChoicePage;
