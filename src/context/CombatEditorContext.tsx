import { EntityInfoFull } from '@models/Battlefield'
import { ControlledBy } from '@models/EditorConversion'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

export const CONTROLLED_BY_PLAYER = (id: string): { type: 'player'; id: string } => ({ type: 'player', id })
export const CONTROLLED_BY_AI = (id: string): { type: 'ai'; id: string } => ({ type: 'ai', id })
export const CONTROLLED_BY_GAME_LOGIC = { type: 'game_logic' }

export interface CombatEditorContextType {
    battlefield: {
        [square: string]: {
            descriptor: string
            character: EntityInfoFull
            control: ControlledBy
        }
    }

    addCharacter: (square: string, character: EntityInfoFull, descriptor: string, control?: ControlledBy) => void
    removeCharacter: (square: string) => void
    updateCharacter: (square: string, character: EntityInfoFull) => void
    updateControl: (square: string, control: ControlledBy) => void

    changePreset: (newData: CombatEditorContextType['battlefield']) => void
    resetPreset: () => void
}

const CombatEditorContext = createContext<CombatEditorContextType | undefined>(undefined)

const CombatEditorContextProvider = ({ children }: { children: ReactNode }) => {
    const [battlefield, setBattlefield] = useState<CombatEditorContextType['battlefield']>({})

    const addCharacter = useCallback(
        (square: string, character: EntityInfoFull, descriptor: string, control?: ControlledBy) => {
            setBattlefield((prev) => {
                return {
                    ...prev,
                    [square]: {
                        descriptor,
                        character,
                        control: control || CONTROLLED_BY_GAME_LOGIC,
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

    const updateCharacter = useCallback((square: string, character: EntityInfoFull) => {
        setBattlefield((prev) => {
            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    character,
                },
            }
        })
    }, [])

    const updateControl = useCallback((square: string, control: ControlledBy) => {
        setBattlefield((prev) => {
            if (!prev[square] || !prev[square].character) {
                return prev
            }

            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    control,
                },
            }
        })
    }, [])

    const changePreset = useCallback((newData: CombatEditorContextType['battlefield']) => {
        setBattlefield(newData)
    }, [])

    const resetPreset = useCallback(() => {
        setBattlefield({})
    }, [])

    return (
        <CombatEditorContext.Provider
            value={{
                battlefield,
                addCharacter,
                removeCharacter,
                updateCharacter,
                updateControl,
                changePreset,
                resetPreset,
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
