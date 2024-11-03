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
import TurnOrderEditor from '@components/CombatEditor/TurnOrderEditor'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { BattlefieldContextProvider, useBattlefieldContext } from '@context/BattlefieldContext'
import { CombatEditorContextProvider, useCombatEditorContext } from '@context/CombatEditorContext'
import { toastError } from '@hooks/useToast'
import { Battlefield as BattlefieldModel } from '@models/GameModels'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import APIService from '@services/APIService'
import EditorHelpers from '@utils/editorHelpers'
import { AxiosError } from 'axios'
import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiAddToQueue } from 'react-icons/bi'
import { FaPlay, FaSave } from 'react-icons/fa'
import { MdOutlineVideogameAssetOff } from 'react-icons/md'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

interface PresetDetails {
    nickName: string
    lobbyID: string
    presetID: string
}

const BattlefieldRepresentation = ({ setClickedSquare }: { setClickedSquare: (square: string | null) => void }) => {
    const { battlefield, removeCharacter, addCharacterToTurnOrder } = useCombatEditorContext()
    const {
        changeBattlefield,
        setInteractableSquares,
        changeOnClickTile,
        incrementClickedSquares,
        resetClickedSquares,
        changeBonusTileTooltipGenerator,
    } = useBattlefieldContext()

    const updateBattlefield = useCallback(() => {
        const newBattlefield: {
            [square: string]: BattlefieldModel['pawns'][string]
        } = {}
        for (const square in battlefield) {
            const [lineStr, columnStr] = square.split('/')
            if (!lineStr || !columnStr || !battlefield[square]) {
                continue
            }
            const line = parseInt(lineStr)
            const column = parseInt(columnStr)
            if (isNaN(line) || isNaN(column)) {
                continue
            }
            newBattlefield[square] = {
                character: {
                    decorations: battlefield[square].decorations,
                    square: { line, column },
                    health: {
                        current: battlefield[square].attributes['builtins:current_health'],
                        max: battlefield[square].attributes['builtins:max_health'],
                    },
                    action_points: {
                        current: battlefield[square].attributes['builtins:current_action_points'],
                        max: battlefield[square].attributes['builtins:max_action_points'],
                    },
                    armor: {
                        current: battlefield[square].attributes['builtins:current_armor'],
                        base: battlefield[square].attributes['builtins:base_armor'],
                    },
                    statusEffects: battlefield[square].statusEffects.map((effect) => ({
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
        changeBonusTileTooltipGenerator((square) => {
            if (!square) return null
            const characterIsPreset = !!(battlefield[square] && battlefield[square].descriptor)
            if (!characterIsPreset) return null
            const buttons: Array<{
                text: string | ReactNode
                onClick: () => void
                variant: 'default' | 'destructive' | 'secondary' | null
                disabled: boolean
            }> = [
                {
                    text: <BiAddToQueue />,
                    onClick: () => {
                        if (!characterIsPreset) return
                        const characterId = battlefield[square].id_
                        addCharacterToTurnOrder(characterId)
                    },
                    variant: 'default',
                    disabled: !characterIsPreset,
                },
                {
                    text: <RiDeleteBin6Line />,
                    onClick: () => {
                        removeCharacter(square)
                    },
                    variant: 'destructive',
                    disabled: !characterIsPreset,
                },
            ]
            return buttons.map((button, index) => (
                <Button
                    key={index}
                    onClick={button.onClick}
                    variant={button.variant}
                    className={'w-full'}
                    disabled={button.disabled}
                >
                    {button.text}
                </Button>
            ))
        })
    }, [battlefield])

    useEffect(() => {
        setTimeout(() => {
            updateBattlefield()
        })
    }, [battlefield])

    return <Battlefield />
}

const RoundHeader = () => {
    const { t } = useTranslation()
    const { round, changeRound } = useCombatEditorContext()
    const [newRound, setNewRound] = useState(round)
    const [editable, setEditable] = useState(false)

    useEffect(() => {
        setNewRound(round)
    }, [round])

    return (
        <div className={'flex flex-row gap-2'}>
            <div className={'flex flex-row gap-2'}>
                <p className={'text-t-big text-white'}>{t('local:editor.round-count')}</p>
                {editable ? (
                    <Input
                        className={`h-full w-[4ch] max-w-[4ch] border-0 border-none border-transparent bg-transparent p-0 font-bold text-secondary underline
                            ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0
                            focus-visible:ring-offset-transparent`}
                        value={parseInt(newRound.toString()).toString()}
                        placeholder={round.toString()}
                        extraClassName={'text-t-big '}
                        type={'number'}
                        onBlur={() => {
                            changeRound(newRound)
                            setEditable(false)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                changeRound(newRound)
                                setEditable(false)
                            } else if (e.key === 'Escape') {
                                setNewRound(round)
                                setEditable(false)
                            }
                        }}
                        autoFocus
                        onFocus={(event) => {
                            const value = event.target.value
                            event.target.value = ''
                            event.target.value = value
                        }}
                        onInput={(e) => {
                            e.preventDefault()
                            if (e.currentTarget.value === '') {
                                setNewRound(0)
                                return
                            }
                            const value = parseInt(e.currentTarget.value)
                            if (isNaN(value)) {
                                return
                            } else if (value <= 0) {
                                setNewRound(0)
                            } else if (value > 999) {
                                setNewRound(999)
                                return
                            } else {
                                setNewRound(parseInt(e.currentTarget.value))
                            }
                        }}
                    />
                ) : (
                    <p
                        className={'text-center text-t-big font-bold text-white'}
                        onDoubleClick={() => {
                            setEditable(true)
                        }}
                    >
                        {round}
                    </p>
                )}
            </div>
        </div>
    )
}

const CombatEditor = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const lobby = useSelector(selectLobbyInfo)

    const { battlefield, changePreset, resetPreset, turnOrder, activeCharacterIndex, round, messages } =
        useCombatEditorContext()

    const [clickedSquare, setClickedSquare] = useState<string | null>(null)
    const [presetDetails, setPresetDetails] = useState<PresetDetails | null>(null)

    const resetCombatEditor = useCallback(() => {
        if (Object.keys(battlefield).length !== 0) {
            resetPreset()
        }
    }, [clickedSquare, battlefield])

    // useEffect(() => {
    //     resetCombatEditor()
    // }, [])

    useEffect(() => {
        if (!lobby?.lobbyId || presetDetails !== null) {
            return
        }
        verifyCombatEditorLocalStorage()
        const lastUsedPreset = getLastUsedCombatEditorPreset(lobby?.lobbyId)
        if (lastUsedPreset) {
            const { data } = lastUsedPreset
            changePreset(data)
            setPresetDetails({
                nickName: lastUsedPreset.nickName,
                lobbyID: lastUsedPreset.lobbyID,
                presetID: lastUsedPreset.presetID,
            })
        }
    }, [lobby])

    const handlePlayButton = useCallback(async () => {
        try {
            const { combat_id } = await APIService.createLobbyCombat(
                lobby.lobbyId,
                'Combat from Editor',
                EditorHelpers.convertGameEditorSaveToExportable({
                    battlefield,
                    turnOrder,
                    activeCharacterIndex,
                    round,
                    messages,
                })
            )
            navigate(paths.gameRoom.replace(':lobbyId', lobby.lobbyId).replace(':gameId', combat_id))
        } catch (e) {
            if (e instanceof AxiosError) {
                toastError({
                    title: t('Something went wrong during save handling'),
                    description: e.response?.data.message,
                })
                console.log(e.response?.data)
            } else {
                console.error(e)
            }
        }
    }, [battlefield, lobby, resetCombatEditor, t])

    return (
        <div className={'flex h-screen max-h-screen w-screen flex-row'}>
            <div className={'relative flex h-full w-3/5 flex-col items-center justify-center gap-3 bg-gray-800'}>
                <div>
                    <RoundHeader />
                </div>
                <div className={'flex flex-row gap-2'}>
                    <TurnOrderEditor />
                    <BattlefieldContextProvider>
                        <BattlefieldRepresentation setClickedSquare={setClickedSquare} />
                    </BattlefieldContextProvider>
                </div>
            </div>
            <div className={'relative flex h-screen w-2/5 flex-col bg-white'}>
                <div className={'flex h-20 w-full flex-row items-center bg-black px-4 text-t-massive'}>
                    <div className={'flex w-full max-w-[90%] flex-row items-center justify-center gap-2'}>
                        <Button
                            className={'size-12 p-1'}
                            variant={'outline'}
                            onClick={() => {
                                saveCombatEditorPreset(
                                    'Preset from Memory',
                                    {
                                        battlefield,
                                        turnOrder,
                                        activeCharacterIndex,
                                        round,
                                        messages,
                                    },
                                    lobby?.lobbyId
                                )
                            }}
                        >
                            <FaSave />
                        </Button>
                        <p
                            className={'h-full w-full truncate text-center text-t-big text-white'}
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
                                    {(clickedSquare ? battlefield[clickedSquare] : null) ? (
                                        <EditCharacterOnSquare clickedSquare={clickedSquare} />
                                    ) : (
                                        <AddNewEntity clickedSquare={clickedSquare} />
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
