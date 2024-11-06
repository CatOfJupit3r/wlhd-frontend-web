import { iCharacterActions as iActionInput } from '@models/GameModels'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

interface iActionChoices {
    [key: keyof iActionInput]: iActionInput[keyof iActionInput][number]['id']
}

export interface iActionContext {
    actions: iActionInput | null
    setOutput: (output: iActionChoices) => void
    choices: iActionChoices
    setChoice: (key: keyof iActionChoices, value: iActionChoices[string]) => void

    resetChoices: () => void
}

const ActionContext = createContext<iActionContext | undefined>(undefined)

export const ActionContextProvider = ({
    actions,
    setOutput,
    children,
}: {
    actions: iActionContext['actions']
    setOutput: iActionContext['setOutput']
    children: ReactNode
}) => {
    const [choices, setChoices] = useState<iActionContext['choices']>({})

    const resetChoices = useCallback(() => {
        setChoices({})
    }, [])

    const setChoice: iActionContext['setChoice'] = useCallback((key, value) => {
        setChoices((prevChoices) => ({
            ...prevChoices,
            [key]: value,
        }))
    }, [])

    return (
        <ActionContext.Provider
            value={{
                actions,
                setOutput,
                choices,
                resetChoices,
                setChoice,
            }}
        >
            {children}
        </ActionContext.Provider>
    )
}

export const useActionContext = () => {
    const context = useContext(ActionContext)
    if (context === undefined) {
        throw new Error('useActionContext must be used within a ActionContextProvider.')
    }
    return context as iActionContext
}
