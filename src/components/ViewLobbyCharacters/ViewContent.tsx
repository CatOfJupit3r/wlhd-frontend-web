import { EntityInfoFull } from '@models/Battlefield'
import { useSelector } from 'react-redux'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import React, { useState } from 'react'
import {
    buildCharacterEditorProps,
    CharacterEditorContextType,
    CharacterEditorProvider,
} from '@components/ContextProviders/CharacterEditorProvider'
import { useCoordinatorEntitiesContext } from '@components/ContextProviders/CoordinatorEntitiesProvider'
import { cn, refreshLobbyInfo } from '@utils'
import { Button } from '@components/ui/button'
import APIService from '@services/APIService'
import { prepareCharacterToClassConversion } from '@utils/editorPrepareFunction'
import { Separator } from '@components/ui/separator'
import CharacterEditor from '@components/CharacterEditor/CharacterEditor'
import { CharacterDisplayInLobby, CharacterDisplayPlaceholder } from '@components/CharacterDisplay'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useViewCharactersContext } from '@components/ContextProviders/ViewCharactersContext'
import { useTranslation } from 'react-i18next'
import Overlay from '@components/Overlay'
import { FaXmark } from 'react-icons/fa6'

const ViewCharacterEditorSettings: CharacterEditorContextType['flags'] = {
    exclude: {},
    attributes: {
        ignored: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    },
    inventory: {
        allowQuantity: true,
        allowCooldown: false,
        allowUses: false,
    },
    weaponry: {
        allowQuantity: true,
        allowCooldown: false,
        allowUses: false,
    },
    statusEffects: {
        allowDuration: true,
    },
    spellBook: {
        allowUses: false,
        allowCooldown: false,
        allowActivation: true,

        allowChangeMaxSpells: true,
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
    } = buildCharacterEditorProps(character as EntityInfoFull)
    const { fetchCharacter } = useCoordinatorEntitiesContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.edit-character',
    })

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
                            <Button
                                variant={'ghost'}
                                onClick={() => {
                                    setDisplayOverlay(false)
                                }}
                            >
                                <FaXmark className={'mr-1 text-[1rem]'} />
                                {t('cancel')}
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

                        // APIService.deleteCharacter(lobby.lobbyId, descriptor)
                        //     .then(() => {
                        //         refreshLobbyInfo(lobby.lobbyId).then()
                        //     })
                        //     .catch((error) => {
                        //         console.error('Error removing character', error)
                        //     })
                    }}
                >
                    <RiDeleteBin6Line />
                    {t('delete-character')}
                </Button>
            )}
        </div>
    )
}

const ViewContent = ({ type }: { type: string }) => {
    const { viewedCharacter: character } = useViewCharactersContext()

    if (!character) {
        return <CharacterDisplayPlaceholder className={componentClass} />
    }

    switch (type) {
        case 'display':
            return (
                <div>
                    <CharacterDisplayInLobby character={character} className={componentClass} />
                </div>
            )
        case 'edit':
            return <CharacterEditorMenu />
        case 'gm-options':
            return <GmOptionMenu />
        default:
            return <CharacterDisplayPlaceholder className={componentClass} />
    }
}

export default ViewContent