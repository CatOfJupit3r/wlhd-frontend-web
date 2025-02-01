import { useParams } from 'react-router';

export const useCurrentLobbyId = () => {
    const { lobbyId } = useParams();

    return lobbyId;
};
