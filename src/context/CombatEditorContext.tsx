import { CharacterDataEditable, CharacterDataEditableInCombat } from '@models/CombatEditorModels'
import { ControlledBy } from '@models/EditorConversion'
import { CharacterInTurnOrder } from '@models/GameModels'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export const CONTROLLED_BY_PLAYER = (id: string): { type: 'player'; id: string } => ({ type: 'player', id })
export const CONTROLLED_BY_AI = (id: string): { type: 'ai'; id: string } => ({ type: 'ai', id })
export const CONTROLLED_BY_GAME_LOGIC = { type: 'game_logic' }


export interface CombatEditorContextType {
    mode: 'save' | 'preset'
    round: number
    battlefield: {
        [square: string]: CharacterDataEditableInCombat
    }
    turnOrder: Array<string>
    activeCharacterIndex: number

    addCharacter: (square: string, character: CharacterDataEditable, descriptor: string, control?: ControlledBy) => void
    removeCharacter: (square: string) => void
    updateCharacter: (square: string, character: CharacterDataEditable | CharacterDataEditableInCombat) => void
    updateControl: (square: string, control: ControlledBy) => void

    changeRound: (newRound: number) => void
    changeTurnOrder: (newTurnOrder: Array<string>) => void
    addCharacterToTurnOrder: (characterId: string) => void
    makeCharacterActive: (index: number) => void

    setMode: (mode: CombatEditorContextType['mode']) => void

    changePreset: (newData: {
        battlefield: CombatEditorContextType['battlefield']
        turnOrder: CombatEditorContextType['turnOrder']
        round: CombatEditorContextType['round']
        activeCharacterIndex: CombatEditorContextType['activeCharacterIndex']
    }) => void
    resetPreset: () => void
}

const CombatEditorContext = createContext<CombatEditorContextType | undefined>(undefined)

const CombatEditorContextProvider = ({ children }: { children: ReactNode }) => {
    const [battlefield, setBattlefield] = useState<CombatEditorContextType['battlefield']>({})
    const [round, setRound] = useState(0)
    const [turnOrder, setTurnOrder] = useState<CombatEditorContextType['turnOrder']>([])
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(0)
    const [mode, setMode] = useState<CombatEditorContextType['mode']>('save')

    const addCharacter = useCallback(
        (square: string, character: CharacterDataEditable, descriptor: string, control?: ControlledBy) => {
            setBattlefield((prev) => {
                const [line, column] = square.split(',').map((n) => parseInt(n))
                return {
                    ...prev,
                    [square]: {
                        ...character,
                        descriptor,
                        id_: crypto.randomUUID(),
                        controlInfo: control || CONTROLLED_BY_GAME_LOGIC,
                        square: { line, column },
                    },
                }
            })
        },
        []
    )

    const removeCharacter = useCallback((square: string) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev }
            delete newBattlefield[square]
            return newBattlefield
        })
    }, [])

    const updateCharacter = useCallback((square: string, character: CharacterDataEditable) => {
        setBattlefield((prev) => {
            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    ...character,
                },
            }
        })
    }, [])

    const updateControl = useCallback((square: string, control: ControlledBy) => {
        setBattlefield((prev) => {
            if (!prev[square]) {
                return prev
            }

            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    controlInfo: control,
                },
            }
        })
    }, [])

    const changePreset = useCallback((newData: {
        battlefield: CombatEditorContextType['battlefield']
        turnOrder: CombatEditorContextType['turnOrder']
        round: CombatEditorContextType['round']
        activeCharacterIndex: CombatEditorContextType['activeCharacterIndex']
    }) => {
        setBattlefield(newData.battlefield)
        setTurnOrder(newData.turnOrder)
        setRound(Math.max(newData.round, 0))
        setActiveCharacterIndex(
            newData.activeCharacterIndex >= 0 && newData.activeCharacterIndex < newData.turnOrder.length
                ? newData.activeCharacterIndex
                : 0
        )
    }, [])

    const resetPreset = useCallback(() => {
        setBattlefield({})
    }, [])

    const changeRound = useCallback((newRound: number) => {
        setRound(newRound)
    }, [])

    const changeTurnOrder = useCallback((newTurnOrder: Array<string>) => {
        setTurnOrder(newTurnOrder)
    }, [])

    const addCharacterToTurnOrder = useCallback((characterId: string) => {
        setTurnOrder((prev) => {
            return [...prev, characterId]
        })
    }, [])

    const makeCharacterActive = useCallback((index: number) => {
        if (index < 0 || index >= turnOrder.length) {
            return
        }
        setActiveCharacterIndex(index)
    }, [turnOrder])

    return (
        <CombatEditorContext.Provider
            value={{
                activeCharacterIndex,
                addCharacter,
                addCharacterToTurnOrder,
                battlefield,
                changePreset,
                changeRound,
                changeTurnOrder,
                mode,
                makeCharacterActive,
                removeCharacter,
                resetPreset,
                round,
                setMode,
                turnOrder,
                updateCharacter,
                updateControl,
            }}
        >
            {children}
        </CombatEditorContext.Provider>
    )
}

const useCombatEditorContext = () => {
    const context = useContext(CombatEditorContext)
    if (context === undefined) {
        throw new Error('useCombatEditorContext must be used within a ViewCharactersContextProvider')
    }
    return context
}

export { CombatEditorContextProvider, useCombatEditorContext }
