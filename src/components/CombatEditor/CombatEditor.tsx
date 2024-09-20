import Battlefield from '@components/Battlefield/Battlefield'
import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay'
import { AddNewEntity } from '@components/CombatEditor/AddNewEntity'
import {
    getLastUsedCombatEditorPreset,
    removeCombatEditorLocalStorage,
    saveCombatEditorPreset,
    verifyCombatEditorLocalStorage,
} from '@components/CombatEditor/CombatEditorLocalStorage'
import { EditCharacterOnSquare } from '@components/CombatEditor/EditCharacterOnSquare'
import { Button } from '@components/ui/button'
import { Toggle } from '@components/ui/toggle'
import { BattlefieldContextProvider, useBattlefieldContext } from '@context/BattlefieldContext'
import { CombatEditorContextProvider, useCombatEditorContext } from '@context/CombatEditorContext'
import { toastError } from '@hooks/useToast'
import { Battlefield as BattlefieldModel } from '@models/GameModels'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPlay, FaSave } from 'react-icons/fa'
import { GrSelect } from 'react-icons/gr'
import { MdOutlineVideogameAssetOff } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import mock_save_file from '@components/CombatEditor/mock_save_file'

interface PresetDetails {
    nickName: string
    lobbyID: string
    presetID: string
}

const BattlefieldRepresentation = ({ setClickedSquare }: { setClickedSquare: (square: string | null) => void }) => {
    const { battlefield } = useCombatEditorContext()
    const {
        changeBattlefield,
        setInteractableSquares,
        changeOnClickTile,
        incrementClickedSquares,
        resetClickedSquares,
    } = useBattlefieldContext()

    const updateBattlefield = useCallback(() => {
        const newBattlefield: {
            [square: string]: BattlefieldModel['pawns'][string]
        } = {}
        for (const square in battlefield) {
            const [lineStr, columnStr] = square.split('/')
            if (!lineStr || !columnStr || !battlefield[square].character) {
                continue
            }
            const line = parseInt(lineStr)
            const column = parseInt(columnStr)
            if (isNaN(line) || isNaN(column)) {
                continue
            }
            newBattlefield[square] = {
                character: {
                    decorations: battlefield[square].character.decorations,
                    square: { line, column },
                    health: {
                        current: battlefield[square].character.attributes['builtins:current_health'],
                        max: battlefield[square].character.attributes['builtins:max_health'],
                    },
                    action_points: {
                        current: battlefield[square].character.attributes['builtins:current_action_points'],
                        max: battlefield[square].character.attributes['builtins:max_action_points'],
                    },
                    armor: {
                        current: battlefield[square].character.attributes['builtins:current_armor'],
                        base: battlefield[square].character.attributes['builtins:base_armor'],
                    },
                    statusEffects: battlefield[square].character.statusEffects.map((effect) => ({
                        ...effect,
                    })),
                },
                areaEffects: [],
            }
        }
        changeBattlefield(
            {
                pawns: newBattlefield,
            },
            { keepActive: true, keepClicked: true, keepInteractable: true }
        )
        setInteractableSquares(
            ...(() => {
                const interactableSquares: Array<string> = []
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 6; j++) {
                        interactableSquares.push(`${i + 1}/${j + 1}`)
                    }
                }
                return interactableSquares
            })()
        )
        changeOnClickTile((square) => {
            if (square) {
                resetClickedSquares()
                incrementClickedSquares(square)
            }
            setClickedSquare(square ?? null)
        })
    }, [battlefield])

    useEffect(() => {
        setTimeout(() => {
            updateBattlefield()
        })
    }, [battlefield])

    return <Battlefield />
}

const CombatEditor = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const lobby = useSelector(selectLobbyInfo)

    const { battlefield, changePreset, resetPreset } = useCombatEditorContext()

    const [clickedSquare, setClickedSquare] = useState<string | null>(null)
    const [presetDetails, setPresetDetails] = useState<PresetDetails | null>(null)

    const resetCombatEditor = useCallback(() => {
        if (Object.keys(battlefield).length !== 0) {
            resetPreset()
        }
    }, [clickedSquare, battlefield])

    useEffect(() => {
        resetCombatEditor()
    }, [])

    useEffect(() => {
        if (!lobby?.lobbyId || presetDetails !== null) {
            return
        }
        verifyCombatEditorLocalStorage()
        const lastUsedPreset = getLastUsedCombatEditorPreset(lobby?.lobbyId)
        if (lastUsedPreset) {
            changePreset(lastUsedPreset.data)
            setPresetDetails({
                nickName: lastUsedPreset.nickName,
                lobbyID: lastUsedPreset.lobbyID,
                presetID: lastUsedPreset.presetID,
            })
        }
    }, [lobby])

    const handlePlayButton = useCallback(async () => {
        // let minifiedCombat
        // try {
            // minifiedCombat = minifyCombat(battlefield)
            // console.log(minifiedCombat)
        // } catch (e: unknown) {
        //     console.log(e)
        //     toastError({ title: t('local:error'), description: e instanceof Error ? e.message : 'Unknown error' })
        //     resetCombatEditor()
        //     if (presetDetails) {
        //         removeCombatEditorLocalStorage(presetDetails.presetID)
        //         setPresetDetails(null)
        //     }
        //     return
        // }
        try {
            const { combat_id } = await APIService.createLobbyCombat(
                lobby.lobbyId,
                'Combat from Editor',
                mock_save_file
            )
            navigate(paths.gameRoom.replace(':lobbyId', lobby.lobbyId).replace(':gameId', combat_id))
        } catch (e) {
            if (e instanceof AxiosError) {
                toastError({ title: t('local:error'), description: e.response?.data.message })
            }
            console.error(e)
        }
    }, [battlefield, lobby, resetCombatEditor, t])

    return (
        <div className={'flex h-screen max-h-screen w-screen flex-row'}>
            <div className={'flex h-full w-3/5 items-center justify-center bg-gray-800'}>
                <BattlefieldContextProvider>
                    <BattlefieldRepresentation setClickedSquare={setClickedSquare} />
                </BattlefieldContextProvider>
            </div>
            <div className={'flex h-screen w-2/5 flex-col bg-white'}>
                <div className={'flex h-20 w-full flex-row items-center bg-black px-4 text-t-massive'}>
                    <div className={'flex w-full flex-row gap-2'}>
                        <Toggle
                            variant={'outline'}
                            className={'size-12 p-1 text-white'}
                            onChange={() => {}}
                            onPressedChange={() => {
                                // we might need a way to change the battlefield mode...
                                // dispatch(setBattlefieldMode(pressed ? 'selection' : 'info'))
                            }}
                        >
                            <GrSelect />
                        </Toggle>
                    </div>
                    <div className={'flex w-full flex-row items-center justify-center gap-2'}>
                        <Button
                            className={'size-12 p-1'}
                            variant={'outline'}
                            onClick={() => {
                                saveCombatEditorPreset('Preset from Memory', battlefield, lobby?.lobbyId)
                            }}
                        >
                            <FaSave />
                        </Button>
                        <p
                            className={'h-full w-[15ch] truncate text-center text-t-big text-white'}
                            title={presetDetails?.nickName || 'Untitled Combat'}
                        >
                            {presetDetails?.nickName || 'Untitled Combat'}
                        </p>
                        <Button
                            className={'size-12 p-1'}
                            variant={'outline'}
                            onClick={() => {
                                handlePlayButton().then()
                            }}
                        >
                            <FaPlay />
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'size-12 p-1'}
                            onClick={() => {
                                resetCombatEditor()
                                if (presetDetails) {
                                    removeCombatEditorLocalStorage(presetDetails.presetID)
                                    setPresetDetails(null)
                                }
                            }}
                        >
                            <RiDeleteBin6Line />
                        </Button>
                    </div>
                    <div className={'flex w-full flex-row justify-end gap-2'}>
                        <Button
                            variant={'outline'}
                            className={'size-12 p-1'}
                            onClick={() =>
                                navigate(
                                    lobby?.lobbyId ? paths.lobbyRoom.replace(':lobbyId', lobby.lobbyId) : paths.home,
                                    { relative: 'path' }
                                )
                            }
                        >
                            <MdOutlineVideogameAssetOff />
                        </Button>
                    </div>
                </div>
                <div className={'no-visible-scrollbar flex h-screen grow flex-col overflow-auto p-4'}>
                    <div className={'flex size-full'}>
                        <div className={'w-full'}>
                            {clickedSquare ? (
                                <div>
                                    <div id={'character-settings'} className={'flex flex-col gap-4'}>
                                        <div className={'flex flex-row gap-2'}>
                                            <AddNewEntity clickedSquare={clickedSquare} />
                                        </div>
                                    </div>
                                    {(clickedSquare ? battlefield[clickedSquare] : null) ? (
                                        <EditCharacterOnSquare clickedSquare={clickedSquare} />
                                    ) : (
                                        <CharacterDisplayPlaceholder
                                            className={'flex flex-col gap-4 rounded border-2 p-4'}
                                        />
                                    )}
                                </div>
                            ) : (
                                <CharacterDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CharacterEditorWithContext = () => {
    return (
        <CombatEditorContextProvider>
            <CombatEditor />
        </CombatEditorContextProvider>
    )
}

export default CharacterEditorWithContext
