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
import { CombatEditorContextProvider, useCombatEditorContext } from '@components/ContextProviders/CombatEditorContext'
import { Button } from '@components/ui/button'
import { Toggle } from '@components/ui/toggle'
import { toastError } from '@hooks/useToast'
import { EntityInfoTooltip } from '@models/Battlefield'
import {
    alreadyClickedOnlyThisSquare,
    resetState,
    selectBattlefieldMode,
    selectClickedSquare,
    setBattlefieldMode,
    setClickedSquare,
    setInteractableSquares,
    setPawns,
} from '@redux/slices/battlefieldSlice'
import { setEntityTooltips } from '@redux/slices/infoSlice'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { minifyCombat } from '@utils/editorPrepareFunction'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FaPlay, FaSave } from 'react-icons/fa'
import { GrSelect } from 'react-icons/gr'
import { MdOutlineVideogameAssetOff } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface PresetDetails {
    nickName: string
    lobbyID: string
    presetID: string
}

const CombatEditor = () => {
    const dispatch = useDispatch<AppDispatch>()
    const battlefieldMode = useSelector(selectBattlefieldMode)
    const clickedSquare = useSelector(selectClickedSquare)
    const lobby = useSelector(selectLobbyInfo)
    const { battlefield, changePreset, resetPreset } = useCombatEditorContext()
    const [presetDetails, setPresetDetails] = useState<PresetDetails | null>(null)
    const navigate = useNavigate()
    const { t } = useTranslation()

    useEffect(() => {
        // each time clickedSquare changes, we add green border to the clicked square.
        if (!clickedSquare) {
            return
        }
        dispatch(alreadyClickedOnlyThisSquare(clickedSquare))
    }, [clickedSquare])

    const resetCombatEditor = useCallback(() => {
        dispatch(resetState())
        if (Object.keys(battlefield).length !== 0) {
            resetPreset()
        }
        dispatch(
            setInteractableSquares(
                (() => {
                    const interactableSquares: { [key: string]: boolean } = {}
                    for (let i = 0; i < 6; i++) {
                        for (let j = 0; j < 6; j++) {
                            interactableSquares[`${i + 1}/${j + 1}`] = true
                        }
                    }
                    return interactableSquares
                })()
            )
        )
        dispatch(setBattlefieldMode('selection'))
        dispatch(setClickedSquare(clickedSquare || '1/1'))
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

    useEffect(() => {
        const newBattlefield: {
            pawns: { [key: string]: string }
            field: string[][]
        } = {
            pawns: {
                '0': 'builtins:tile',
            },
            field: [
                ['0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0'],
                ['0', '0', '0', '0', '0', '0'],
            ],
        }
        const tooltips: { [square: string]: EntityInfoTooltip | null } = {}
        let counter: number = 0
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
            counter++
            newBattlefield.pawns[counter.toString()] = battlefield[square].character.decorations.sprite
            newBattlefield.field[line - 1][column - 1] = counter.toString()
            tooltips[square] = {
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
                    descriptor: undefined,
                })),
            }
        }
        dispatch(setPawns(newBattlefield))
        dispatch(setEntityTooltips(tooltips))
    }, [battlefield])

    const handlePlayButton = useCallback(async () => {
        let minifiedCombat
        try {
            minifiedCombat = minifyCombat(battlefield)
            console.log(minifiedCombat)
        } catch (e: unknown) {
            console.log(e)
            toastError({ title: t('local:error'), description: e instanceof Error ? e.message : 'Unknown error' })
            resetCombatEditor()
            if (presetDetails) {
                removeCombatEditorLocalStorage(presetDetails.presetID)
                setPresetDetails(null)
            }
            return
        }
        try {
            const { combat_id } = await APIService.createLobbyCombat(
                lobby.lobbyId,
                minifiedCombat.nickName,
                minifiedCombat.battlefield
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
                <Battlefield />
            </div>
            <div className={'flex h-screen w-2/5 flex-col bg-white'}>
                <div className={'flex h-20 w-full flex-row items-center bg-black px-4 text-t-massive'}>
                    <div className={'flex w-full flex-row gap-2'}>
                        <Toggle
                            variant={'outline'}
                            className={'size-12 p-1 text-white'}
                            onChange={() => {}}
                            pressed={battlefieldMode === 'selection'}
                            onPressedChange={(pressed) => {
                                dispatch(setBattlefieldMode(pressed ? 'selection' : 'info'))
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
                                            <AddNewEntity />
                                        </div>
                                    </div>
                                    {(clickedSquare ? battlefield[clickedSquare] : null) ? (
                                        <EditCharacterOnSquare />
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
