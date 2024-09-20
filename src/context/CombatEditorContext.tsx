import { ControlledBy } from '@models/EditorConversion'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { CharacterDataEditable } from '@models/CombatEditorModels'

export const CONTROLLED_BY_PLAYER = (id: string): { type: 'player'; id: string } => ({ type: 'player', id })
export const CONTROLLED_BY_AI = (id: string): { type: 'ai'; id: string } => ({ type: 'ai', id })
export const CONTROLLED_BY_GAME_LOGIC = { type: 'game_logic' }

export interface CombatEditorContextType {
    mode: 'save' | 'preset'
    battlefield: {
        [square: string]: {
            descriptor: string
            character: CharacterDataEditable
            control: ControlledBy
        }
    }

    addCharacter: (square: string, character: CharacterDataEditable, descriptor: string, control?: ControlledBy) => void
    removeCharacter: (square: string) => void
    updateCharacter: (square: string, character: CharacterDataEditable) => void
    updateControl: (square: string, control: ControlledBy) => void

    setMode: (mode: CombatEditorContextType['mode']) => void

    changePreset: (newData: CombatEditorContextType['battlefield']) => void
    resetPreset: () => void
}

const CombatEditorContext = createContext<CombatEditorContextType | undefined>(undefined)

const CombatEditorContextProvider = ({ children }: { children: ReactNode }) => {
    const [battlefield, setBattlefield] = useState<CombatEditorContextType['battlefield']>({})
    const [mode, setMode] = useState<CombatEditorContextType['mode']>('save')

    const addCharacter = useCallback(
        (square: string, character: CharacterDataEditable, descriptor: string, control?: ControlledBy) => {
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

    const updateCharacter = useCallback((square: string, character: CharacterDataEditable) => {
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
                mode,
                setMode,
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
