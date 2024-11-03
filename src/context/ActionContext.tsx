import { ActionInput as ActionInputInterface } from '@models/GameModels'
import { createContext, ReactNode, useCallback, useContext, useState } from 'react'

type Choices = {
    mechanic: { [key: string]: string }
    displayed: { [key: string]: string }
}

export interface ActionContextType {
    actions: ActionInputInterface | null
    setOutput: (output: Choices['mechanic']) => void
    choices: Choices
    setChoice: (key: keyof Choices['mechanic'], mechanic: string, displayed: string) => void

    resetChoices: () => void

    [key: string]: unknown
}

const ActionContext = createContext<ActionContextType | undefined>(undefined)

export const ActionContextProvider = ({
    actions,
    setOutput,
    children,
}: {
    actions: ActionContextType['actions']
    setOutput: ActionContextType['setOutput']
    children: ReactNode
}) => {
    const [choices, setChoices] = useState<ActionContextType['choices']>({
        mechanic: {},
        displayed: {},
    })

    const resetChoices = useCallback(() => {
        setChoices({
            mechanic: {},
            displayed: {},
        })
    }, [])

    const setChoice: ActionContextType['setChoice'] = useCallback((key, mechanic, displayed) => {
        setChoices((prevChoices) => ({
            ...prevChoices,
            mechanic: {
                ...prevChoices.mechanic,
                [key]: mechanic,
            },
            displayed: {
                ...prevChoices.displayed,
                [key]: displayed,
            },
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
    return context as ActionContextType
}
