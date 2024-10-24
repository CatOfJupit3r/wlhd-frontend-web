import CharacterEditor from '@components/CharacterEditor/CharacterEditor'
import { Button } from '@components/ui/button'
import { Label } from '@components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import {
    CharacterEditorContextType,
    CharacterEditorProvider,
    useBuildCharacterEditorProps,
} from '@context/CharacterEditorProvider'
import { useCombatEditorContext } from '@context/CombatEditorContext'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useCallback, useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { FaXmark } from 'react-icons/fa6'
import { GrContactInfo } from 'react-icons/gr'
import { HiOutlineArrowUturnLeft } from 'react-icons/hi2'
import { IoMdPersonAdd } from 'react-icons/io'
import { useSelector } from 'react-redux'

const CombatCharacterEditorSettings: CharacterEditorContextType['flags'] = {
    attributes: {
        ignored: [],
        nonEditable: [],
    },
    exclude: {
        name: true,
        description: true,
        sprite: true,

        attributes: false,
        inventory: false,
        spellBook: false,
        statusEffects: false,
        weaponry: false,
    },
}

const EditCharacterControls = ({
    newControls,
    setNewControls,
    clickedSquare,
}: {
    newControls: { type: string; id?: string }
    setNewControls: (value: { type: string; id?: string }) => void
    clickedSquare: string | null
}) => {
    const lobby = useSelector(selectLobbyInfo)
    const { battlefield } = useCombatEditorContext()

    return (
        <div>
            <div className={'flex flex-col gap-4 rounded border-2 p-4'}>
                <div className={'flex flex-col gap-2'}>
                    <div className={'w-full'}>
                        <Label>Controlled by</Label>
                        <Select
                            onValueChange={(value) => {
                                let changeTo
                                const character = battlefield[clickedSquare as string].controlInfo
                                if (character.type === value && character.id) {
                                    changeTo = {
                                        type: value,
                                        id: character.id,
                                    }
                                } else {
                                    changeTo = {
                                        type: value,
                                    }
                                }
                                setNewControls(changeTo)
                            }}
                            value={newControls.type}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={'Select...'} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Controlled by</SelectLabel>
                                    <SelectItem value={'player'}>Player</SelectItem>
                                    <SelectItem value={'ai'}>AI</SelectItem>
                                    <SelectItem value={'game_logic'}>Game Logic</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        {newControls.type === 'player' ? (
                            <>
                                <Label>Player</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setNewControls({
                                            ...newControls,
                                            id: value,
                                        })
                                    }}
                                    value={newControls.id}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={'Select player'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Player</SelectLabel>

                                            {lobby.players.map((player) => (
                                                <SelectItem key={player.userId} value={player.userId}>
                                                    {player.nickname} (@{player.handle})
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </>
                        ) : newControls.type === 'ai' ? ( // for now, game servers do not have a list of AIs
                            <>
                                <Label>AI</Label>
                                <Select
                                    onValueChange={(value) => {
                                        setNewControls({
                                            ...newControls,
                                            id: value,
                                        })
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={'AI'} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>AI</SelectLabel>
                                            <SelectItem value={'default'}>Not really implemented</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export const EditCharacterOnSquare = ({ clickedSquare }: { clickedSquare: string | null }) => {
    const lobby = useSelector(selectLobbyInfo)
    const { updateCharacter, removeCharacter, updateControl, addCharacterToTurnOrder } = useCombatEditorContext()
    const { battlefield } = useCombatEditorContext()
    const [isEditing, setIsEditing] = useState<'character' | 'controls'>('character')
    const { character, changeEditedCharacter, resetCharacter } = useBuildCharacterEditorProps(
        battlefield[clickedSquare as string]
    )
    const [newControls, setNewControls] = useState<{
        type: string
        id?: string
    }>(battlefield[clickedSquare as string].controlInfo)

    useEffect(() => {
        if (clickedSquare) {
            const newCharacter = battlefield[clickedSquare]
            if (character && newCharacter && JSON.stringify(character) !== JSON.stringify(newCharacter)) {
                changeEditedCharacter(newCharacter)
                setNewControls(newCharacter.controlInfo)
                setIsEditing('character')
            }
        }
    }, [clickedSquare, battlefield])

    const handleSaveButton = useCallback(() => {
        if (!clickedSquare || !character) {
            return
        }
        if (isEditing === 'controls') {
            if (newControls.type === 'player') {
                if (
                    !lobby ||
                    !newControls.id ||
                    newControls.id === '' ||
                    !lobby.players.find((player) => player.userId === newControls.id)
                ) {
                    return
                }
            } else if (newControls.type === 'ai') {
                if (!newControls.id || newControls.id === '') {
                    return
                }
            } else if (newControls.type !== 'game_logic') {
                return
            }
            updateControl(clickedSquare, {
                type: newControls.type,
                id: newControls.type === 'game_logic' ? undefined : newControls.id,
            })
        } else {
            updateCharacter(clickedSquare, character)
        }
    }, [isEditing, clickedSquare, character, updateCharacter, resetCharacter, newControls, lobby])

    const handleResetButton = useCallback(() => {
        if (isEditing === 'controls' && clickedSquare && battlefield[clickedSquare as string]) {
            setNewControls(battlefield[clickedSquare as string].controlInfo)
        } else {
            resetCharacter()
        }
    }, [isEditing, clickedSquare, battlefield, resetCharacter])

    return (
        <div className={'mt-4'}>
            <div className={'mb-3 flex w-full justify-between'}>
                <div className={'flex flex-col gap-3'}>
                    <div>
                        <Button
                            className={'flex w-52 justify-between gap-2'}
                            onClick={() => {
                                setIsEditing(isEditing === 'character' ? 'controls' : 'character')
                            }}
                        >
                            Mode:
                            {isEditing === 'character' ? (
                                <div className={'flex items-center gap-1'}>
                                    <GrContactInfo />
                                    Character
                                </div>
                            ) : (
                                <div className={'flex items-center gap-1'}>
                                    <IoMdPersonAdd />
                                    Controls
                                </div>
                            )}
                        </Button>
                    </div>
                    <div className={'flex gap-2'}>
                        <Button className={'flex w-full'} onClick={handleSaveButton}>
                            <FaSave className={'mr-1'} />
                            Save
                        </Button>
                        <Button className={'flex w-full'} onClick={handleResetButton}>
                            <HiOutlineArrowUturnLeft className={'mr-1'} />
                            Restore
                        </Button>
                        <Button
                            className={'flex w-full'}
                            onClick={() => {
                                if (!clickedSquare || !character) {
                                    return
                                }
                                addCharacterToTurnOrder(character.id_)
                            }}
                        >
                            Add to Turn Order
                        </Button>
                    </div>
                </div>
                <div className={'flex h-full'}>
                    <Button
                        variant={'destructive'}
                        className={'flex size-full'}
                        onClick={() => {
                            if (!clickedSquare) {
                                return
                            }
                            removeCharacter(clickedSquare)
                        }}
                    >
                        <FaXmark className={'mr-1'} />
                        Remove
                    </Button>
                </div>
            </div>
            <CharacterEditorProvider
                character={character}
                setEditedCharacter={changeEditedCharacter}
                flags={CombatCharacterEditorSettings}
            >
                {isEditing === 'character' ? (
                    <CharacterEditor className={'flex w-full flex-col gap-4 rounded border-2 p-4'} />
                ) : (
                    <EditCharacterControls
                        newControls={newControls}
                        setNewControls={setNewControls}
                        clickedSquare={clickedSquare}
                    />
                )}
            </CharacterEditorProvider>
        </div>
    )
}
