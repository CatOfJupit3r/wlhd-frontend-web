import ViewCharacterLobby from '@components/ViewLobbyCharacters/ViewLobbyCharacters';
import { FC } from 'react';

interface ViewCharacterPageProps {
    initial: string | null;
}

const ViewCharacterPage: FC<ViewCharacterPageProps> = ({ initial }) => {
    return <ViewCharacterLobby initial={initial} />;
};

export default ViewCharacterPage;
