import GameAsset from '@components/GameAsset';
import { Button, TimeoutButton } from '@components/ui/button';
import { Combobox } from '@components/ui/combobox';
import { Separator } from '@components/ui/separator';
import { CharacterControlInfo } from '@components/ViewLobbyCharacters/CharacterControlInfo';
import ViewContent from '@components/ViewLobbyCharacters/ViewContent';
import { useViewCharactersContext, ViewCharactersContextProvider } from '@context/ViewCharactersContext';
import useCoordinatorCharacter from '@queries/useCoordinatorCharacter';
import useThisLobby from '@queries/useThisLobby';
import { useNavigate } from '@tanstack/react-router';
import { cn } from '@utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaEdit } from 'react-icons/fa';
import { GrContactInfo } from 'react-icons/gr';
import { RiAdminFill } from 'react-icons/ri';

const NoCharactersPresent = () => {
    const { lobby } = useThisLobby();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.no-characters',
    });
    const navigate = useNavigate();

    return (
        <div className={'flex flex-col items-center gap-2 p-4'}>
            <h1>{t('header')}</h1>
            <div className={'flex max-w-[50%] flex-col gap-1 text-xl max-[960px]:max-w-full'}>
                <p>{t('explain')}</p>
                <div className={'mt-4 flex w-full flex-col gap-1'}>
                    <Button
                        onClick={() => {
                            navigate({
                                to: '/lobby-rooms/$lobbyId/create-character',
                                params: {
                                    lobbyId: lobby.lobbyId,
                                },
                            });
                        }}
                    >
                        {t('create-character')}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate({
                                to: '/lobby-rooms/$lobbyId',
                                params: {
                                    lobbyId: lobby.lobbyId,
                                },
                            });
                        }}
                        variant={'outline'}
                    >
                        {t('return-lobby')}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ViewLobbyCharacters = ({ initial }: { initial: null | string }) => {
    const { lobby } = useThisLobby();
    const { changeViewedCharacter } = useViewCharactersContext();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer',
    });
    const navigate = useNavigate();
    const [descriptor, setDescriptor] = useState<string>(initial ?? '');
    const { character, refetch, isError } = useCoordinatorCharacter(lobby.lobbyId, descriptor);

    const [characterMenu, setCharacterMenu] = useState<string>('display');

    useEffect(() => {
        if (!descriptor) {
            changeViewedCharacter(null, null);
            return;
        }
        if (!character) return;
        if (descriptor === character.descriptor) return;
        changeViewedCharacter(character, descriptor);
    }, [character, descriptor]);

    useEffect(() => {
        if (isError) {
            changeViewedCharacter(null, null);
        }
    }, [isError]);

    return (
        <div className={cn('flex w-full flex-row justify-center gap-4 py-4 max-[960px]:flex-col')}>
            {lobby.characters.length === 0 ? (
                <NoCharactersPresent />
            ) : (
                <>
                    <div className={'flex w-96 flex-col gap-2 max-[960px]:w-full'}>
                        <div className={'flex flex-col gap-1'}>
                            <Combobox
                                items={lobby.characters.map((c) => ({
                                    value: c.descriptor,
                                    label: c.decorations ? `${c.decorations.name} (@${c.descriptor})` : c.descriptor,
                                    icon: c.decorations
                                        ? () => (
                                              <GameAsset
                                                  src={c.decorations.sprite}
                                                  alt={c.descriptor}
                                                  className={'size-10'}
                                              />
                                          )
                                        : undefined,
                                }))}
                                includeSearch={true}
                                value={descriptor}
                                onChange={(value) => {
                                    setDescriptor(value);
                                }}
                            />
                            <Separator />
                            <TimeoutButton
                                variant={'secondary'}
                                className={'w-full'}
                                timeoutTime={10000}
                                disabled={!descriptor}
                                onClick={() => {
                                    if (!descriptor) return;
                                    refetch().then();
                                }}
                            >
                                {t('refresh-character')}
                            </TimeoutButton>
                            {lobby.layout === 'gm' && (
                                <>
                                    <Button
                                        variant={'outlineToDefault'}
                                        onClick={() => {
                                            navigate({
                                                to: '/lobby-rooms/$lobbyId/create-character',
                                                params: {
                                                    lobbyId: lobby.lobbyId,
                                                },
                                            });
                                        }}
                                    >
                                        {t('goto-character-creator')}
                                    </Button>
                                </>
                            )}
                            <Separator />
                            <CharacterControlInfo />
                        </div>
                        <div className={'flex flex-col gap-1'}>
                            {[
                                {
                                    icon: GrContactInfo,
                                    label: t('selectors.display'),
                                    value: 'display',
                                },
                                {
                                    icon: FaEdit,
                                    label: t('selectors.edit-character'),
                                    value: 'edit',
                                    disabled: lobby.layout !== 'gm',
                                },
                                {
                                    icon: RiAdminFill,
                                    label: t('selectors.gm-options'),
                                    value: 'gm-options',
                                    disabled: lobby.layout !== 'gm',
                                },
                            ].map((item, index) => {
                                if (item.disabled) return null;
                                return (
                                    <Button
                                        key={index}
                                        onClick={
                                            item.disabled
                                                ? () => {
                                                      return;
                                                  }
                                                : () => {
                                                      setCharacterMenu(item.value);
                                                  }
                                        }
                                        disabled={!descriptor || item.disabled || false}
                                        className={
                                            'flex flex-row justify-normal gap-1 text-left max-[960px]:justify-center'
                                        }
                                    >
                                        <item.icon className={'size-4'} />
                                        <p>{item.label}</p>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                    <ViewContent type={characterMenu} />
                </>
            )}
        </div>
    );
};

const ViewCharacterLobbyUsable = ({ initial }: { initial?: string | null }) => {
    return (
        <ViewCharactersContextProvider>
            <ViewLobbyCharacters initial={initial || null} />
        </ViewCharactersContextProvider>
    );
};

export default ViewCharacterLobbyUsable;
