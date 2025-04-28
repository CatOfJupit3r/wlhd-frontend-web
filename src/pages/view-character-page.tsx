import { FC } from 'react';

import ViewCharacterLobby from '@components/ViewLobbyCharacters/ViewLobbyCharacters';

interface ViewCharacterPageProps {
    initial: string | null;
}

const ViewCharacterPage: FC<ViewCharacterPageProps> = ({ initial }) => {
    return <ViewCharacterLobby initial={initial} />;
};

export default ViewCharacterPage;
