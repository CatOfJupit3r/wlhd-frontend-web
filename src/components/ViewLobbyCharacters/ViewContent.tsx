import { CharacterDisplayInLobby, CharacterDisplayPlaceholder } from '@components/CharacterDisplay'
import CharacterEditor from '@components/CharacterEditor/CharacterEditor'
import Overlay from '@components/Overlay'
import { Button } from '@components/ui/button'
import { Separator } from '@components/ui/separator'
import {
    useBuildCharacterEditorProps,
    CharacterEditorContextType,
    CharacterEditorProvider,
} from '@context/CharacterEditorProvider'
import { useCoordinatorEntitiesContext } from '@context/CoordinatorEntitiesProvider'
import { useViewCharactersContext } from '@context/ViewCharactersContext'
import { CharacterDataEditable } from '@models/CombatEditorModels'
import { EntityInfoFull } from '@models/GameModels'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import APIService from '@services/APIService'
import GameConverters from '@services/GameConverters'
import { cn, refreshLobbyInfo } from '@utils'
import { prepareCharacterToClassConversion } from '@utils/editorPrepareFunction'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaXmark } from 'react-icons/fa6'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'

const ViewCharacterEditorSettings: CharacterEditorContextType['flags'] = {
    exclude: {},
    attributes: {
        ignored: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    },
}

const componentClass = 'flex w-[30rem] flex-col gap-4 rounded border-2 p-4 max-[960px]:w-full'

const CharacterEditorMenu = () => {
    const { viewedCharacter: character, descriptor, changeViewedCharacter } = useViewCharactersContext()
    const lobby = useSelector(selectLobbyInfo)
    const {
        character: editedCharacter,
        changeEditedCharacter,
        resetCharacter,
    } = useBuildCharacterEditorProps({ ...character } as CharacterDataEditable)
    const { fetchCharacter } = useCoordinatorEntitiesContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.edit-character',
    })

    useEffect(() => {
        if (!character) {
            return
        }
        changeEditedCharacter({ ...character })
    }, [character])

    return (
        <div className={cn(componentClass, 'flex flex-col gap-2')}>
            <div id={'editor-controls'} className={'flex w-full flex-row gap-1'}>
                <Button
                    variant={'destructive'}
                    className={'w-full'}
                    onClick={() => {
                        resetCharacter()
                    }}
                >
                    {t('reset')}
                </Button>
                <Button
                    className={'w-full'}
                    onClick={() => {
                        if (!descriptor) {
                            return
                        }
                        const wasCharacterChanged: boolean =
                            JSON.stringify(character) !== JSON.stringify(editedCharacter)
                        if (wasCharacterChanged) {
                            // TODO: create omit function to only send changed fields

                            APIService.updateCharacter(
                                lobby.lobbyId,
                                descriptor as string,
                                prepareCharacterToClassConversion(editedCharacter)
                            )
                                .then(() => {
                                    console.log('Character was updated')
                                    refreshLobbyInfo(lobby.lobbyId).then(() => {
                                        fetchCharacter(lobby.lobbyId, descriptor, true)
                                            .then((data) => {
                                                changeViewedCharacter(data, descriptor)
                                            })
                                            .catch((e) => {
                                                console.error(e)
                                                changeViewedCharacter(null, null)
                                            })
                                    })
                                })
                                .catch((error) => {
                                    console.error('Error updating character', error.response.data)
                                })
                        }
                    }}
                >
                    {t('save')}
                </Button>
            </div>
            <Separator />
            <CharacterEditorProvider
                character={editedCharacter}
                setEditedCharacter={changeEditedCharacter}
                flags={ViewCharacterEditorSettings}
            >
                <CharacterEditor className={'w-full border-0'} />
            </CharacterEditorProvider>
        </div>
    )
}

const GmOptionMenu = () => {
    const lobby = useSelector(selectLobbyInfo)
    const [displayOverlay, setDisplayOverlay] = useState(false)
    const { descriptor } = useViewCharactersContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.gm-options',
    })

    return (
        <div className={cn(componentClass, 'justify-end')}>
            {displayOverlay ? (
                <Overlay>
                    <div className={'flex max-w-[30rem] flex-col items-center gap-2 text-center'}>
                        <h3>{t('confirmation')}</h3>
                        <p className={'mb-2 font-normal italic'}>{t('details')}</p>
                        <div className={'flex flex-row gap-2'}>
                            <Button
                                variant={'ghost'}
                                onClick={() => {
                                    setDisplayOverlay(false)
                                }}
                            >
                                <FaXmark className={'mr-1 text-[1rem]'} />
                                {t('cancel')}
                            </Button>
                            <Button
                                variant={'destructive'}
                                onClick={() => {
                                    if (!descriptor || !lobby) {
                                        return
                                    }
                                    APIService.deleteCharacter(lobby.lobbyId, descriptor)
                                        .then(() => {
                                            refreshLobbyInfo(lobby.lobbyId).then()
                                        })
                                        .catch((error) => {
                                            console.error('Error removing character', error)
                                        })
                                }}
                            >
                                <RiDeleteBin6Line className={'mr-1 text-[1rem] text-white'} />
                                {t('delete')}
                            </Button>
                        </div>
                    </div>
                </Overlay>
            ) : (
                <Button
                    id={'remove-character'}
                    className={'gap-1'}
                    variant={'destructive'}
                    onClick={() => {
                        if (!descriptor || !lobby) {
                            return
                        }
                        setDisplayOverlay(true)
                    }}
                >
                    <RiDeleteBin6Line />
                    {t('delete-character')}
                </Button>
            )}
        </div>
    )
}

const LobbyCharacterDisplay = () => {
    const { viewedCharacter } = useViewCharactersContext()
    const [converted, setConverted] = useState<EntityInfoFull | null>(null)

    useEffect(() => {
        if (!viewedCharacter) {
            setConverted(null)
        } else {
            setConverted(GameConverters.convertEditableToInfoFull(viewedCharacter))
        }
    }, [viewedCharacter])

    if (!viewedCharacter) {
        return <CharacterDisplayPlaceholder className={componentClass} />
    }

    return (
        <div>
            {converted ? (
                <CharacterDisplayInLobby character={converted} className={componentClass} />
            ) : (
                <CharacterDisplayPlaceholder className={componentClass} />
            )}
        </div>
    )
}

const ViewContent = ({ type }: { type: string }) => {
    const { viewedCharacter } = useViewCharactersContext()

    if (!viewedCharacter) {
        return <CharacterDisplayPlaceholder className={componentClass} />
    }

    switch (type) {
        case 'display':
            return <LobbyCharacterDisplay />
        case 'edit':
            return <CharacterEditorMenu />
        case 'gm-options':
            return <GmOptionMenu />
        default:
            return <CharacterDisplayPlaceholder className={componentClass} />
    }
}

export default ViewContent
