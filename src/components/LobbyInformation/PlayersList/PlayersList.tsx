import { Button, MutationButton } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ScrollArea } from '@components/ui/scroll-area';
import { Separator } from '@components/ui/separator';
import { iLobbyInformation, iLobbyPlayerInfo, iWaitingApprovalPlayer } from '@models/Redux';
import useRefreshLobbyPlayers from '@mutations/lobby-overview/useRefreshLobbyPlayers';
import { cn } from '@utils';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUserPlus } from 'react-icons/fa6';
import { LuUsers } from 'react-icons/lu';
import { TbRefreshDot } from 'react-icons/tb';
import { LOBBY_INFO_MODALS, LOBBY_INFO_MODALS_TYPE } from '../types';
import PlayerDisplay from './PlayerDisplay';

interface iPlayersList {
    className?: string;
    players: Array<iLobbyPlayerInfo>;
    waitingPlayers: Array<iWaitingApprovalPlayer>;
    layout: iLobbyInformation['layout'];
    setModalType: (value: LOBBY_INFO_MODALS_TYPE) => void;
    lobbyId: string;
}

const PlayersList: FC<iPlayersList> = ({ className, players, layout, setModalType, lobbyId, waitingPlayers }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.players',
    });
    const { refreshLobbyPlayers, isPending } = useRefreshLobbyPlayers();

    return (
        <Card>
            <CardHeader className={'flex flex-row items-center justify-between'}>
                <CardTitle>
                    <LuUsers className={'mr-2 inline-block'} />
                    {t('title')}
                </CardTitle>
                <div className={'flex gap-2'}>
                    <MutationButton
                        mutate={() => {
                            if (!lobbyId) return;
                            refreshLobbyPlayers(lobbyId);
                        }}
                        isPending={isPending}
                        className={'h-8 text-sm'}
                        variant={'outline'}
                    >
                        <TbRefreshDot />
                        {/*{t('refresh')}*/}
                    </MutationButton>

                    {layout === 'gm' ? (
                        <Button
                            className={'h-8 text-sm'}
                            onClick={() => setModalType(LOBBY_INFO_MODALS.INVITE_PLAYERS)}
                        >
                            <FaUserPlus />
                            {/*{t('invite-players')}*/}
                        </Button>
                    ) : null}
                </div>
            </CardHeader>
            <CardContent>
                <ScrollArea className={cn(className, 'h-[300px]')}>
                    <div className={'flex w-full flex-col gap-2 border-0 p-0'}>
                        {players.map((player) => {
                            return (
                                <PlayerDisplay
                                    player={player}
                                    key={player.userId}
                                    layout={layout}
                                    lobbyId={lobbyId}
                                    isApproved={true}
                                />
                            );
                        })}
                    </div>
                    {waitingPlayers.length === 0 ? null : <Separator className={'my-3'} />}
                    <div className={'flex w-full flex-col gap-2 border-0 p-0'}>
                        {waitingPlayers.map((player) => {
                            return (
                                <PlayerDisplay
                                    player={{
                                        ...player,
                                        nickname: player.name,
                                        characters: [],
                                    }}
                                    key={player.name}
                                    layout={layout}
                                    lobbyId={lobbyId}
                                    isApproved={false}
                                />
                            );
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default PlayersList;
