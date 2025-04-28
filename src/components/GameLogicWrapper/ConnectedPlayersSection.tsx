import { iGameLobbyState } from '@type-defs/game-types';
import { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCrown } from 'react-icons/fa';

import UserAvatar from '@components/UserAvatars';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import useThisLobby from '@queries/useThisLobby';
import { cn } from '@utils';

interface iPlayerCard {
    info: iGameLobbyState['players'][number];
}

const PlayerCard: FC<iPlayerCard> = ({ info: { userId, isConnected, isGm } }) => {
    const { lobby } = useThisLobby();
    const userInLobby = useMemo(() => lobby.players.find((player) => player.userId === userId), [lobby, userId]);
    if (!userInLobby) {
        return null;
    }
    return (
        <div className={'flex flex-row items-center gap-1 p-2'}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={'flex h-full w-full flex-row items-center gap-1'}>
                        <div className={'relative'}>
                            <UserAvatar userId={userInLobby.userId} className={'rounded-lg border-none shadow-none'} />
                            {isGm && <FaCrown className={'absolute right-0 top-0 text-amber-300'} />}
                        </div>
                        <div className={cn('h-full w-3 rounded-xl', isConnected ? 'bg-green-500' : 'bg-red-500')} />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{userInLobby.nickname}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

const ConnectedPlayersSection: FC<{ gameLobbyState: iGameLobbyState }> = ({ gameLobbyState }) => {
    const { t } = useTranslation('local', { keyPrefix: 'game.pending' });

    return (
        <div className={'flex w-full flex-col justify-center'}>
            <p className={'text-center'}>{t('players-in-game')}</p>
            <div className={'flex flex-row flex-wrap justify-center'}>
                {gameLobbyState.players.map((info, index) => (
                    <PlayerCard key={index} info={info} />
                ))}
            </div>
        </div>
    );
};

export default ConnectedPlayersSection;
