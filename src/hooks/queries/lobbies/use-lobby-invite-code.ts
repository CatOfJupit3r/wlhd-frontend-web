import { useQuery } from '@tanstack/react-query';
import { iInviteCode } from '@type-defs/api-data';

import { useCurrentLobbyId } from '@hooks/use-current-lobby-id';
import { THIS_LOBBY_QUERY_KEYS } from '@queries/lobbies/use-this-lobby';
import APIService from '@services/api-service';

const DEFAULT_INVITE_CODES: Array<iInviteCode> = [];

export const LOBBY_INVITE_CODE_QUERY_KEYS = (lobbyId: string) => [...THIS_LOBBY_QUERY_KEYS(lobbyId), 'inviteCodes'];

const useLobbyInviteCode = () => {
    const lobbyId = useCurrentLobbyId();

    const { data: codes } = useQuery<Array<iInviteCode>>({
        enabled: !!lobbyId,
        queryKey: LOBBY_INVITE_CODE_QUERY_KEYS(lobbyId!),

        // Query function to fetch user data
        queryFn: async () => {
            if (!lobbyId) throw new Error('No lobby ID provided');
            return APIService.getInviteCodes({ lobbyId });
        },
        refetchOnWindowFocus: true,
        retry: 1,
    });
    return {
        codes: codes ?? DEFAULT_INVITE_CODES,
    };
};

export default useLobbyInviteCode;
