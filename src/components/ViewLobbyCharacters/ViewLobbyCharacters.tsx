import GameAsset from '@components/GameAsset'
import { Button, TimeoutButton } from '@components/ui/button'
import { Combobox } from '@components/ui/combobox'
import { Separator } from '@components/ui/separator'
import { CharacterControlInfo } from '@components/ViewLobbyCharacters/CharacterControlInfo'
import ViewContent from '@components/ViewLobbyCharacters/ViewContent'
import { useCoordinatorCharactersContext } from '@context/CoordinatorCharactersProvider'
import { useViewCharactersContext, ViewCharactersContextProvider } from '@context/ViewCharactersContext'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import { cn } from '@utils'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaEdit } from 'react-icons/fa'
import { GrContactInfo } from 'react-icons/gr'
import { RiAdminFill } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const NoCharactersPresent = () => {
    const lobby = useSelector(selectLobbyInfo)
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.no-characters',
    })
    const navigate = useNavigate()

    return (
        <div className={'flex flex-col items-center gap-2 p-4'}>
            <h1>{t('header')}</h1>
            <div className={'flex max-w-[50%] flex-col gap-1 text-xl max-[960px]:max-w-full'}>
                <p>{t('explain')}</p>
                <div className={'mt-4 flex w-full flex-col gap-1'}>
                    <Button
                        onClick={() => {
                            navigate(paths.createCharacter.replace(':lobbyId', lobby.lobbyId))
                        }}
                    >
                        {t('create-character')}
                    </Button>
                    <Button
                        onClick={() => {
                            navigate(paths.lobbyRoom.replace(':lobbyId', lobby.lobbyId))
                        }}
                        variant={'outline'}
                    >
                        {t('return-lobby')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const ViewLobbyCharacters = ({ initial }: { initial: null | string }) => {
    const lobby = useSelector(selectLobbyInfo)
    const { fetchCharacter } = useCoordinatorCharactersContext()
    const { viewedCharacter, changeViewedCharacter, descriptor } = useViewCharactersContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer',
    })
    const navigate = useNavigate()

    useEffect(() => {
        console.log('Character in View was changed')
    }, [viewedCharacter])

    const [current, setCurrent] = useState<null | number>(null)
    const [characterMenu, setCharacterMenu] = useState<string>('display')

    useEffect(() => {
        if (descriptor !== null && !lobby.characters.map((c) => c.descriptor).includes(descriptor)) {
            changeViewedCharacter(null, null)
            setCurrent(null)
        }
    }, [lobby.characters])

    useEffect(() => {
        if (initial && lobby && lobby.characters) {
            setCurrent(lobby.characters.findIndex((c) => c.descriptor === initial))
        }
    }, [initial, lobby])

    useEffect(() => {
        if (current === null || current === -1) {
            console.log('No character selected')
            changeViewedCharacter(null, null)
        } else if (lobby && lobby.characters && lobby.characters[current]) {
            const descriptor = lobby.characters[current].descriptor
            fetchCharacter(lobby.lobbyId, descriptor)
                .then((data) => {
                    changeViewedCharacter(data, descriptor)
                })
                .catch((e) => {
                    console.error(e)
                    changeViewedCharacter(null, null)
                })
        }
    }, [current])

    return (
        <div className={cn('flex w-full flex-row justify-center max-[960px]:flex-col')}>
            {lobby.characters.length === 0 ? (
                <NoCharactersPresent />
            ) : (
                <>
                    <div className={'flex w-96 flex-col gap-2 p-4 max-[960px]:w-full'}>
                        <div className={'flex flex-col gap-1'}>
                            <Combobox
                                items={lobby.characters.map((c, index) => ({
                                    value: index.toString(),
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
                                value={current === null ? '' : current.toString()}
                                onChange={(value) => {
                                    const valueAsNumber = parseInt(value)
                                    if (isNaN(valueAsNumber)) {
                                        setCurrent(null)
                                    } else if (valueAsNumber < 0 || valueAsNumber >= lobby.characters.length) {
                                        setCurrent(null)
                                    } else if (valueAsNumber === current) {
                                        return
                                    } else {
                                        setCurrent(parseInt(value))
                                    }
                                }}
                            />
                            <Separator />
                            <TimeoutButton
                                variant={'secondary'}
                                className={'w-full'}
                                timeoutTime={10000}
                                disabled={current === null || current === -1}
                                onClick={() => {
                                    if (current === null || current === -1) {
                                        return
                                    }
                                    fetchCharacter(lobby.lobbyId, lobby.characters[current].descriptor, true)
                                        .then((data) => {
                                            changeViewedCharacter(data, lobby.characters[current].descriptor)
                                        })
                                        .catch((e) => {
                                            console.error(e)
                                            changeViewedCharacter(null, null)
                                        })
                                }}
                            >
                                {t('refresh-character')}
                            </TimeoutButton>
                            {lobby.layout === 'gm' && (
                                <>
                                    <Button
                                        variant={'outlineToDefault'}
                                        onClick={() => {
                                            navigate(paths.createCharacter.replace(':lobbyId', lobby.lobbyId))
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
                                return (
                                    <Button
                                        key={index}
                                        onClick={
                                            item.disabled
                                                ? () => {
                                                      return
                                                  }
                                                : () => {
                                                      setCharacterMenu(item.value)
                                                  }
                                        }
                                        disabled={current === null || item.disabled || false}
                                        className={
                                            'flex flex-row justify-normal gap-1 text-left max-[960px]:justify-center'
                                        }
                                    >
                                        <item.icon className={'size-4'} />
                                        <p>{item.label}</p>
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                    <ViewContent type={characterMenu} />
                </>
            )}
        </div>
    )
}

const ViewCharacterLobbyUsable = ({ initial }: { initial?: string | null }) => {
    return (
        <ViewCharactersContextProvider>
            <ViewLobbyCharacters initial={initial || null} />
        </ViewCharactersContextProvider>
    )
}

export default ViewCharacterLobbyUsable
