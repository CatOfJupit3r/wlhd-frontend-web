import { MutationButton } from '@components/ui/button';
import { Combobox } from '@components/ui/combobox';
import { ScrollArea } from '@components/ui/scroll-area';
import { StaticSkeleton } from '@components/ui/skeleton';
import UserAvatar from '@components/UserAvatars';
import { useViewCharactersContext } from '@context/ViewCharactersContext';
import { iLobbyPlayerInfo } from '@models/Redux';
import useAssignPlayerToCharacter from '@mutations/view-character/useAssignPlayerToCharacter';
import useRemovePlayerFromCharacter from '@mutations/view-character/useRemovePlayerFromCharacter';
import useThisLobby from '@queries/useThisLobby';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { IoAdd } from 'react-icons/io5';

const Placeholder = () => {
    return (
        <div>
            <StaticSkeleton className={'h-6 w-[12ch]'} />
            <StaticSkeleton className={'mt-1 h-10 w-full'} />
        </div>
    );
};

export const filterPlayersByControlledDescriptor = (descriptor: string | null, reverse = false) => {
    if (!descriptor) {
        return () => false;
    }
    if (reverse) {
        return (player: iLobbyPlayerInfo) => {
            return (
                !player.characters || !player.characters.some(([playerDescriptor]) => playerDescriptor === descriptor)
            );
        };
    }
    return (player: iLobbyPlayerInfo) => {
        return player.characters && player.characters.some(([playerDescriptor]) => playerDescriptor === descriptor);
    };
};

const ChangeControlledBy = () => {
    const [playerToAdd, setPlayerToAdd] = useState<string>('');
    const { lobby, refetch } = useThisLobby();
    const { descriptor } = useViewCharactersContext();
    const { mutate, isPending } = useAssignPlayerToCharacter();

    return (
        <div className={'flex h-10 flex-row gap-2'}>
            <Combobox
                items={lobby.players.filter(filterPlayersByControlledDescriptor(descriptor, true)).map((player) => ({
                    value: player.userId,
                    label: player.handle,
                    icon: () => (
                        <UserAvatar
                            handle={player.handle}
                            className={'size-8 border-2'}
                            style={{ borderRadius: '50%' }}
                        />
                    ),
                }))}
                value={playerToAdd}
                onChange={(value) => {
                    setPlayerToAdd(value);
                }}
                size={{
                    height: 'h-full',
                }}
            />
            <MutationButton
                isPending={isPending}
                mutate={() => {
                    if (!descriptor || !playerToAdd) {
                        return;
                    }
                    mutate({
                        lobbyId: lobby.lobbyId,
                        descriptor,
                        playerId: playerToAdd,
                    });
                }}
                variant={'secondary'}
                className={'h-full'}
            >
                <IoAdd />
            </MutationButton>
        </div>
    );
};

const PlainListOfPlayers = ({ playersInControl }: { playersInControl: iLobbyPlayerInfo[] }) => {
    const { lobby } = useThisLobby();
    const { mutate, isPending } = useRemovePlayerFromCharacter();
    const { descriptor } = useViewCharactersContext();

    return (
        <ScrollArea className={'mt-2 flex h-[100px] flex-col gap-1'}>
            {playersInControl.map((player) => {
                return (
                    <div key={player.handle} className={'relative flex flex-row items-center gap-2'}>
                        <UserAvatar handle={player.handle} className={'size-8 border-2'} />
                        <p className={'max-w-[75%]'}>@{player.handle}</p>
                        <MutationButton
                            isPending={isPending}
                            mutate={() => {
                                if (!descriptor || !player.userId) {
                                    return;
                                }
                                mutate({
                                    lobbyId: lobby.lobbyId,
                                    descriptor,
                                    playerId: player.userId,
                                });
                            }}
                            variant={'destructiveGhost'}
                            className={
                                'absolute right-0 p-3 text-red-700 opacity-60 hover:opacity-100 active:border-red-600 active:text-red-600'
                            }
                        >
                            <FaXmark className={'size-4'} />
                        </MutationButton>
                    </div>
                );
            })}
        </ScrollArea>
    );
};

export const CharacterControlInfo = () => {
    const { lobby } = useThisLobby();
    const { descriptor } = useViewCharactersContext();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.control-details',
    });

    const playersInControl = useMemo(
        () => lobby.players.filter(filterPlayersByControlledDescriptor(descriptor || '')),
        [lobby, descriptor],
    );

    if (!descriptor) {
        return <Placeholder />;
    }

    return (
        <div className={'flex flex-col gap-2 rounded border-2 px-4 py-2'}>
            <div className={'flex flex-col gap-4 p-1'}>
                <p className={'text-wrap font-medium'}>{t('controlled-by')}</p>
                {playersInControl?.length > 0 ? (
                    <PlainListOfPlayers playersInControl={playersInControl} />
                ) : (
                    <p className={'h-[108px] italic text-gray-400'}>{t('empty')}</p>
                )}
                {lobby.layout === 'gm' ? <ChangeControlledBy /> : null}
            </div>
        </div>
    );
};
