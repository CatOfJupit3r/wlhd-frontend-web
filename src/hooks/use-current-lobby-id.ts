import { useParams } from '@tanstack/react-router';

export const useCurrentLobbyId = () => {
    const { lobbyId } = useParams({
        strict: false,
    });

    return lobbyId;
};
