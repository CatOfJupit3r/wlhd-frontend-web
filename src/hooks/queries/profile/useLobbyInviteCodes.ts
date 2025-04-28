import { useQuery } from '@tanstack/react-query';
import { iInviteCode } from '@type-defs/api-data';

import { useCurrentLobbyId } from '@hooks/useCurrentLobbyId';
import APIService from '@services/api-service';

const placeholder: Array<iInviteCode> = [];

const useLobbyInviteCodes = () => {
    const lobbyId = useCurrentLobbyId();

    const { data: codes } = useQuery<Array<iInviteCode>>({
        enabled: true,
        queryKey: ['lobby', lobbyId, 'inviteCodes'],

        // Query function to fetch user data
        queryFn: async () => {
            if (!lobbyId) throw new Error('No lobby ID provided');
            return APIService.getInviteCodes({ lobbyId });
        },
        refetchOnWindowFocus: true,
        retry: 1,

        placeholderData: placeholder,
    });
    return {
        codes: codes ?? placeholder,
    };
};

export default useLobbyInviteCodes;
