import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ActionInput.module.css'

import { useTranslation } from 'react-i18next'

import { BsArrowBarLeft } from 'react-icons/bs'

import ElementWithIcon from '@components/ElementWithIcon'
import { useActionContext } from '@context/ActionContext'
import { useBattlefieldContext } from '@context/BattlefieldContext'
import { useToast } from '@hooks/useToast'

import {
    selectActionAliases,
    selectActionAliasTranslations,
    selectActions,
    selectIsYourTurn,
} from '@redux/slices/gameScreenSlice'
import { capitalizeFirstLetter } from '@utils'
import { RxArrowTopRight } from 'react-icons/rx'
import OptionCard from './OptionCard/OptionCard'
import { Action } from '@models/GameModels'

/*

This component is responsible for handling user input during the game.

Communicates with Battlefield components to receive user input from the battlefield (purely UX feature).

    Shallow Depth and Deep Depth Screens

    During handling of possible user actions, action input can be displayed in two different states.
Shallow depth refers to state when there are still possible options for user to choose.
This refers both to initial action level and to requirements to those actions.

When all the actions are chosen and there is nothing more to select, we move to deep depth screen. (using setReachedFinalDepth)

    When we reach deep depth, we display what user has chosen and give him option to submit or go back to previous action.
If he decides to go back, we reset ALL choices and start from the beginning.
However, if he decides to submit, we set readyToSubmit in ReduxStore to true.
Then, other components can decide what to do with this input.
This isolated responsibilities of this component to only handle user input and not to handle any other logic of sending the input to the server.


*/

const EmptyActionInputContent = () => {
    const { t } = useTranslation()

    return (
        <h1
            style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginTop: '10px',
            }}
        >
            {t('local:game.actions.waiting_for_turn')}
        </h1>
    )
}

const ActionInput = () => {
    const dispatch = useDispatch()
    const { actions, setOutput } = useActionContext()
    const {
        incrementClickedSquares,
        changeOnClickTile,
        setInteractableSquares,
        resetInteractableSquares,
        resetClickedSquares,
    } = useBattlefieldContext()
    const { t } = useTranslation()
    const { toastError } = useToast()

    const initialActionLevel = useSelector(selectActions)

    const aliases = useSelector(selectActionAliases)
    const aliasesTranslations = useSelector(selectActionAliasTranslations)

    const isPlayerTurn = useSelector(selectIsYourTurn)

    const [currentAlias, setCurrentAlias] = useState('action')
    const [scopeOfChoice, setScopeOfChoice] = useState(
        {} as {
            [key: string]: string
        }
    )
    const { choices, resetChoices, setChoice } = useActionContext()

    const [needToAddInteractableTiles, setNeedToAddInteractableTiles] = useState<
        | {
              flag: false
              action?: Action[]
          }
        | {
              flag: true
              action: Action[]
          }
    >({
        flag: false,
    })

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    const options = useMemo(() => {
        let action: Action[] = []
        let aliasValue = ''
        if (currentAlias) {
            if (currentAlias === 'action') {
                action = initialActionLevel?.action ?? []
            } else {
                aliasValue = scopeOfChoice[currentAlias]
                action = aliases?.[aliasValue] ?? []
            }
        }

        return (
            action?.map((action: Action, index: number) => {
                return (
                    <OptionCard
                        option={action}
                        index={index}
                        key={index}
                        alias={currentAlias}
                        aliasTranslated={
                            aliasesTranslations
                                ? currentAlias && currentAlias !== 'action'
                                    ? aliasesTranslations[scopeOfChoice[currentAlias]]
                                    : aliasesTranslations[currentAlias]
                                : ''
                        }
                    />
                )
            }) ?? []
        )
            .sort((a: JSX.Element, b: JSX.Element) => {
                return b?.props.option.translation_info.descriptor.localeCompare(
                    a?.props.option.translation_info.descriptor
                )
            })
            .sort((a: JSX.Element) => {
                return a?.props.option.available ? -1 : 1
            })
    }, [actions, currentAlias, scopeOfChoice, aliasesTranslations])

    const appendScope = useCallback((scope: { [key: string]: string }) => {
        setScopeOfChoice((prev) => ({ ...prev, ...scope }))
    }, [])

    const handleReset = useCallback(() => {
        resetInputs()
    }, [])

    const resetInputs = useCallback(() => {
        setCurrentAlias('action')
        setScopeOfChoice({})
        resetChoices()
        setReachedFinalDepth(false)
        resetInteractableSquares()
        resetClickedSquares()
    }, [])

    const ResetButton = useCallback(() => {
        return (
            <ElementWithIcon
                icon={<BsArrowBarLeft onClick={handleReset} />}
                element={<p>{t('local:game.actions.reset')}</p>}
            />
        )
    }, [handleReset, t])

    const handleErrorCase = useCallback(() => {
        console.debug('It seems like choices.mechanic is undefined. Investigate.', choices)
        setOutput({ action: 'builtins:skip' })
    }, [t])

    const handleSend = useCallback(() => {
        if (choices.mechanic === undefined) {
            handleErrorCase()
        } else {
            setOutput(choices.mechanic)
        }
        resetInputs()
    }, [choices, handleReset])

    const ConfirmButton = useCallback(() => {
        return (
            <ElementWithIcon
                icon={<RxArrowTopRight onClick={handleSend} />}
                element={<p>{t('local:game.actions.submit')}</p>}
            />
        )
    }, [choices, handleReset])

    const ShallowDepthScreenContent = useCallback(() => {
        let action: Action[] = []
        let aliasValue = ''
        if (aliases && currentAlias) {
            if (currentAlias === 'action') {
                action = initialActionLevel?.action ?? []
            } else {
                aliasValue = scopeOfChoice[currentAlias]
                action = aliases[aliasValue]
            }
        }

        if (initialActionLevel === null) {
            return <h1 className={'mt-2 text-center text-t-big font-bold'}>Loading...</h1>
        } else if (!action || action.length === 0 || options.length === 0) {
            setTimeout(handleErrorCase)
            toastError({
                title: t('local:game.actions.error'),
                description: t('local:error.no_actions'),
            })
            return <h1 className={'mt-2 text-center text-t-big font-bold'}>Loading...</h1>
        } else if (aliasValue.startsWith('Square')) {
            return <h1 className={'mt-2 text-center text-t-big font-bold'}>{t('local:game.actions.choose_square')}</h1>
        } else {
            return <>{options}</>
        }
    }, [initialActionLevel, currentAlias, scopeOfChoice, aliases, options, handleErrorCase])

    const ShallowDepthScreen = useCallback(() => {
        return (
            <>
                <div
                    id={'buttons'}
                    className={styles.buttonContainer}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div id={'manipulators'}>
                        <ResetButton />
                    </div>
                </div>
                <div id={'options'} className={styles.options}>
                    <ShallowDepthScreenContent />
                </div>
            </>
        )
    }, [currentAlias, scopeOfChoice, aliases, options])

    const FinalDepthScreen = useCallback(() => {
        return (
            <>
                <h1>{t('local:game.actions.you_chose')}</h1>
                {choices.displayed ? (
                    <p>
                        {Object.entries(choices.displayed)
                            .map(([key, value]) => `${capitalizeFirstLetter(t(key))}: ${t(value)}`)
                            .join(', ')}
                    </p>
                ) : (
                    <h2>{t('local:game.actions.nothing?')}</h2>
                )}
                <div className={styles.buttonContainer}>
                    <ConfirmButton />
                    <ResetButton />
                </div>
            </>
        )
    }, [dispatch, t, choices, handleReset])

    useEffect(() => {
        if (!needToAddInteractableTiles.flag) {
            return
        }
        const interactableSquares = []
        for (const action of needToAddInteractableTiles.action) {
            interactableSquares.push(action.id)
        }
        changeOnClickTile((square) => {
            if (!square) {
                console.log('No square was provided despite it being required.')
                return
            }
            setChoice(currentAlias, square, square)
            incrementClickedSquares(square)
        })
        setInteractableSquares(...interactableSquares)
        setNeedToAddInteractableTiles({ flag: false, action: [] })
    }, [needToAddInteractableTiles])

    useEffect(() => {
        if (actions === null) {
            // if component is unmounted, then <BattlefieldCleaner /> will reset interactable squares
            resetInputs()
        }
    }, [actions])

    useEffect(() => {
        let action: Action[] = []
        let aliasValue = ''
        if (aliases && currentAlias) {
            if (currentAlias === 'action') {
                action = initialActionLevel?.action ?? []
            } else {
                aliasValue = scopeOfChoice[currentAlias]
                action = aliases[aliasValue]
            }
        }
        if (aliasValue.startsWith('Square')) {
            setNeedToAddInteractableTiles({
                flag: true,
                action,
            })
        }
    }, [currentAlias, scopeOfChoice, aliases])

    useEffect(() => {
        if (initialActionLevel === null || !currentAlias || choices.mechanic[currentAlias] === undefined) {
            return
        }
        if (currentAlias === 'action') {
            const choice = choices.mechanic[currentAlias]
            const action = initialActionLevel.action.find((action: Action) => action.id === choice)
            if (action) {
                const nextRequirements = action.requires
                if (nextRequirements) {
                    appendScope(nextRequirements)
                    setCurrentAlias(Object.keys(nextRequirements)[0])
                } else {
                    if (!reachedFinalDepth) {
                        setReachedFinalDepth(true)
                    }
                }
            } else {
                toastError({
                    title: t('local:game.actions.you_chose'),
                    description: t('local:error.invalid_choice'),
                })
            }
        } else {
            // scope keeps track of requirements to process.
            // if we have chosen an action and there is another requirement in scope that haven't been defined, we move to next requirement
            // else, we set reached final depth, and it is possible to submit input
            const action = aliases?.[scopeOfChoice[currentAlias]]
            resetInteractableSquares()
            if (action) {
                const selectedAction = action.find((action: Action) => action.id === choices.mechanic[currentAlias])
                if (selectedAction && selectedAction.requires) {
                    appendScope(selectedAction.requires)
                }
            }
            const nextRequirements = Object.keys(scopeOfChoice).filter((key: string) => {
                return choices.mechanic[key] === undefined
            })
            if (nextRequirements.length > 0) {
                setReachedFinalDepth(false)
                setCurrentAlias(nextRequirements[0])
            } else {
                setReachedFinalDepth(true)
            }
        }
    }, [choices, currentAlias, scopeOfChoice, initialActionLevel])

    return (
        <div id={'action-input'} className={styles.inputsContainer}>
            {isPlayerTurn ? (
                <div id={'current-depth-visual'}>
                    {reachedFinalDepth ? <FinalDepthScreen /> : <ShallowDepthScreen />}
                </div>
            ) : (
                <EmptyActionInputContent />
            )}
        </div>
    )
}

export default ActionInput
