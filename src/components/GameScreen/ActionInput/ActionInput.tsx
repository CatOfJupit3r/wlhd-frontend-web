import { Action } from '@models/ActionInput'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './ActionInput.module.css'

import {
    receivedHalt,
    resetInput,
    selectAliases,
    selectAliasTranslations,
    selectEntityActions,
    selectHalted,
    selectOutput,
    selectPlayersTurn,
    setOutput,
} from '@redux/slices/turnSlice'

import { useTranslation } from 'react-i18next'

import { BsArrowBarLeft } from 'react-icons/bs'

import ElementWithIcon from '@components/ElementWithIcon'
import {
    addClickedSquare,
    resetAlreadyClickedSquares, resetInteractableSquares,
    resetStateAfterSquareChoice,
    selectBattlefieldMode,
    selectClickedSquare,
    setBattlefieldMode,
    setInteractableSquares,
} from '@redux/slices/battlefieldSlice'
import { capitalizeFirstLetter } from '@utils'
import { RxArrowTopRight } from 'react-icons/rx'
import OptionCard from './OptionCard/OptionCard'
import { useToast } from '@hooks/useToast'
import ResultListener from '@components/GameScreen/ActionInput/ResultListener'

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

const ActionInput = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { toast, toastError } = useToast()

    const initialActionLevel = useSelector(selectEntityActions)

    const aliases = useSelector(selectAliases)
    const aliasesTranslated = useSelector(selectAliasTranslations)

    const clickedSquare = useSelector(selectClickedSquare)
    const battlefieldMode = useSelector(selectBattlefieldMode)
    const isPlayerTurn = useSelector(selectPlayersTurn)
    const output = useSelector(selectOutput)
    const halted = useSelector(selectHalted)

    const [currentAlias, setCurrentAlias] = useState('action')
    const [scopeOfChoice, setScopeOfChoice] = useState(
        {} as {
            [key: string]: string
        }
    )
    const [choices, setChoices] = useState({
        mechanic: {},
        displayed: {},
    } as {
        mechanic: { [key: string]: string }
        displayed: { [key: string]: string }
    })
    const [clickedAction, setClickedAction] = useState(
        null as {
            mechanic_val: string
            displayed_val: string
        } | null
    )

    const [needToAddInteractableTiles, setNeedToAddInteractableTiles] = useState({
        flag: false,
        action: initialActionLevel.action,
    })

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    useEffect(() => {
        if (!needToAddInteractableTiles.flag) {
            return
        }
        const interactableSquares = {} as { [key: string]: boolean }
        for (const action of needToAddInteractableTiles.action) {
            interactableSquares[action.id] = true
        }
        dispatch(resetInteractableSquares())
        dispatch(setInteractableSquares(interactableSquares))
        setNeedToAddInteractableTiles({ flag: false, action: [] })
    }, [needToAddInteractableTiles])

    const options = useMemo(() => {
        let action: Action[] = []
        let aliasValue = ''
        if (currentAlias) {
            if (currentAlias === 'action') {
                action = initialActionLevel.action
            } else {
                aliasValue = scopeOfChoice[currentAlias]
                action = aliases[aliasValue]
            }
        }

        if (!action || action.length === 0) {
            // add auto skip in this case and display error
            dispatch(resetInput())
            return (
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginTop: '10px',
                    }}
                >
                    {t('local:game.actions.no_available_actions')}
                </h1>
            )
        }

        if (aliasValue.startsWith('Square')) {
            setNeedToAddInteractableTiles({
                flag: true,
                action,
            })
            return (
                <h1
                    style={{
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        marginTop: '10px',
                    }}
                >
                    {t('local:game.actions.choose_square')}
                </h1>
            )
        }

        return action.map((action: Action, index: number) => {
            return (
                <OptionCard
                    option={action}
                    index={index}
                    key={index}
                    callback={() => {
                        setClickedAction({
                            mechanic_val: action.id,
                            displayed_val: t(`${action.translation_info.descriptor}.name`),
                        })
                    }}
                    highlighted={clickedAction?.mechanic_val === action.id}
                />
            )
        })
    }, [currentAlias, aliases, scopeOfChoice, choices.mechanic, choices, initialActionLevel.action])

    const appendScope = useCallback((scope: { [key: string]: string }) => {
        setScopeOfChoice((prev) => ({ ...prev, ...scope }))
    }, [])

    const handleReset = useCallback(() => {
        dispatch(resetStateAfterSquareChoice())
        resetInputs()
    }, [])

    const resetClickedAction = useCallback(() => {
        setClickedAction(null)
    }, [])

    const resetInputs = useCallback(() => {
        setCurrentAlias('action')
        setScopeOfChoice({})
        setChoices({
            mechanic: {},
            displayed: {},
        })
        setClickedAction(null)
        setReachedFinalDepth(false)
        dispatch(resetAlreadyClickedSquares())
    }, [])

    useEffect(() => {
        if (halted) {
            resetInputs()
            dispatch(receivedHalt())
        }
    }, [halted])

    useEffect(() => {
        if (!clickedAction || clickedAction.mechanic_val === '' || clickedAction.displayed_val === '') {
            return
        }
        toast({
            title: t('local:game.actions.you_chose'),
            description: t(clickedAction.displayed_val),
            position: 'bottom-left',
        })
        setChoices((prev) => ({
            mechanic: { ...prev.mechanic, [currentAlias]: clickedAction.mechanic_val },
            displayed: {
                ...prev.displayed,
                [currentAlias && currentAlias !== 'action'
                    ? aliasesTranslated[scopeOfChoice[currentAlias]]
                    : aliasesTranslated[currentAlias]]: clickedAction.displayed_val,
            },
        }))
        resetClickedAction()
    }, [clickedAction, currentAlias, battlefieldMode, scopeOfChoice])

    useEffect(() => {
        // this effect listens for click on battlefield.
        if (clickedSquare && battlefieldMode === 'selection') {
            setChoices((prev) => ({
                mechanic: { ...prev.mechanic, [currentAlias]: clickedSquare },
                displayed: {
                    ...prev.displayed,
                    [currentAlias && currentAlias !== 'action'
                        ? aliasesTranslated[scopeOfChoice[currentAlias]]
                        : aliasesTranslated[currentAlias]]: clickedSquare,
                },
            }))
            dispatch(addClickedSquare(clickedSquare))
            dispatch(resetStateAfterSquareChoice())
        }
    }, [clickedSquare])

    useEffect(() => {
        const aliasValue = scopeOfChoice[currentAlias]
        if (!currentAlias || aliasValue === undefined) {
            return
        }
        if (aliasValue.startsWith('Square') && choices.mechanic[currentAlias] === undefined) {
            if (battlefieldMode === 'info') {
                dispatch(setBattlefieldMode('selection'))
            }
        } else {
            if (battlefieldMode === 'selection') {
                dispatch(setBattlefieldMode('info'))
            }
        }
    }, [currentAlias, choices.mechanic, choices, scopeOfChoice, t])

    const ResetButton = useCallback(() => {
        return (
            <ElementWithIcon
                icon={
                    <BsArrowBarLeft
                        onClick={() => {
                            setReachedFinalDepth(false)
                            handleReset()
                        }}
                    />
                }
                element={<p>{t('local:game.actions.reset')}</p>}
            />
        )
    }, [handleReset, t])

    const ConfirmButton = useCallback(() => {
        return (
            <ElementWithIcon
                icon={
                    <RxArrowTopRight
                        onClick={() => {
                            if (choices.mechanic === undefined) {
                                setChoices({
                                    mechanic: {
                                        action: 'builtins:skip',
                                    },
                                    displayed: {
                                        action: 'builtins:skip',
                                    },
                                })
                            }
                            setReachedFinalDepth(false)
                            resetInputs()
                            dispatch(setOutput(choices.mechanic))
                        }}
                    />
                }
                element={<p>{t('local:game.actions.submit')}</p>}
            />
        )
    }, [choices, handleReset])

    const shallowDepthScreen = useCallback(() => {
        if (Array.isArray(options)) {
            options
                .sort((a, b) => {
                    return b.props.option.translation_info.descriptor.localeCompare(
                        a.props.option.translation_info.descriptor
                    )
                })
                .sort((a) => {
                    return a.props.option.available ? -1 : 1
                })
        }
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
                    {options}
                </div>
            </>
        )
    }, [options, reachedFinalDepth])

    const deepDepthScreen = useCallback(() => {
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
        if (!currentAlias || choices.mechanic[currentAlias] === undefined || output !== null) {
            return
        }
        if (choices.mechanic[currentAlias] !== undefined && currentAlias === 'action') {
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
            const action = aliases[scopeOfChoice[currentAlias]]
            action &&
                (() => {
                    const selectedAction = action.find((action: Action) => action.id === choices.mechanic[currentAlias])
                    if (selectedAction && selectedAction.requires) {
                        appendScope(selectedAction.requires)
                    }
                })()
            const nextRequirements = Object.keys(scopeOfChoice).filter((key: string) => !choices.mechanic[key])
            if (nextRequirements.length > 0) {
                setCurrentAlias(nextRequirements[0])
            } else {
                setReachedFinalDepth(true)
            }
        }
    }, [
        choices.mechanic,
        currentAlias,
        scopeOfChoice,
        initialActionLevel.action,
        dispatch,
        handleReset,
        reachedFinalDepth,
        output,
    ])

    return (
        <div id={'action-input'} className={styles.inputsContainer}>
            {isPlayerTurn ? (
                <div id={'current-depth-visual'}>{reachedFinalDepth ? deepDepthScreen() : shallowDepthScreen()}</div>
            ) : (
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
            )}
            <ResultListener />
        </div>
    )
}

export default ActionInput
