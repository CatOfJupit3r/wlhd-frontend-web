import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Action } from '../../models/ActionInput'
import { setNotify } from '../../redux/slices/cosmeticsSlice'
import styles from './ActionInput.module.css'

import {
    appendScope,
    resetChosenAction,
    resetInput,
    selectAliases,
    selectAliasTranslations,
    selectChoices,
    selectChosenAction,
    selectCurrentAlias,
    selectEntityActions,
    selectPlayersTurn,
    selectReadyToSubmit,
    selectScope,
    selectTranslatedChoices,
    setChoice,
    setCurrentAlias,
    setReadyToSubmit,
    setTranslatedChoice,
} from '../../redux/slices/turnSlice'

import { useTranslation } from 'react-i18next'

import { BsArrowBarLeft } from 'react-icons/bs'

import { RxArrowTopRight } from 'react-icons/rx'
import {
    resetStateAfterSquareChoice,
    selectBattlefieldMode,
    selectClickedSquare,
    setBattlefieldMode,
} from '../../redux/slices/battlefieldSlice'
import OptionCard from './OptionCard/OptionCard'

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


When we choose item inside select or square, it is written to current choices in format:

choices[currentAlias]: chosenValue
translatedChoices[aliasesTranslations[currentAlias]]: chosenValueTranslation


TODO: Fix Action Input not reacting to HALT_ACTION events (which, surprisingly, should stop and reset the action input)

*/

const ActionInput = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const initialActionLevel = useSelector(selectEntityActions)
    const currentAlias = useSelector(selectCurrentAlias)
    const aliasesTranslations = useSelector(selectAliasTranslations)
    const choices = useSelector(selectChoices)
    const scope = useSelector(selectScope)
    const aliases = useSelector(selectAliases)
    const chosenActionStore = useSelector(selectChosenAction)
    const translatedChoices = useSelector(selectTranslatedChoices)
    const clickedSquare = useSelector(selectClickedSquare)
    const battlefieldMode = useSelector(selectBattlefieldMode)
    const isPlayerTurn = useSelector(selectPlayersTurn)
    const inputReadyToSubmit = useSelector(selectReadyToSubmit)

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    const handleReset = useCallback(() => {
        dispatch(resetInput())
    }, [dispatch])

    const handleDepth = useCallback((): JSX.Element => {
        return currentAlias && currentAlias !== 'action' ? (
            <BsArrowBarLeft onClick={() => handleReset()} />
        ) : (
            <BsArrowBarLeft />
        )
    }, [currentAlias, handleReset])

    useEffect(() => {
        if (
            !chosenActionStore ||
            chosenActionStore.chosenActionValue === '' ||
            chosenActionStore.translatedActionValue === ''
        ) {
            return
        }
        dispatch(
            setNotify({
                message: chosenActionStore.translatedActionValue,
                code: 200,
            })
        )
        dispatch(
            setTranslatedChoice({
                key: t(
                    currentAlias && currentAlias !== 'action'
                        ? aliasesTranslations[scope[currentAlias]]
                        : aliasesTranslations[currentAlias]
                ),
                value: chosenActionStore.translatedActionValue,
            })
        )
        dispatch(
            setChoice({
                key: currentAlias,
                value: chosenActionStore.chosenActionValue,
            })
        )
        dispatch(resetChosenAction())
    }, [chosenActionStore, dispatch, t, aliasesTranslations, currentAlias, battlefieldMode, scope])

    useEffect(() => {
        // this effect listens for click on battlefield.
        if (clickedSquare && battlefieldMode === 'selection') {
            dispatch(
                setChoice({
                    key: currentAlias,
                    value: clickedSquare,
                })
            )
            dispatch(resetStateAfterSquareChoice())
        }
    }, [clickedSquare])

    const generateOptions = useCallback((): JSX.Element | JSX.Element[] => {
        let action: Action[] = []
        let aliasValue = ''
        if (currentAlias) {
            if (currentAlias === 'action') {
                action = initialActionLevel.action
            } else {
                aliasValue = scope[currentAlias]
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
            return <OptionCard option={action} index={index} t={t} key={index} />
        })
    }, [t, currentAlias, aliases, scope, choices, initialActionLevel.action, dispatch])

    useEffect(() => {
        const aliasValue = scope[currentAlias]
        if (!currentAlias || aliasValue === undefined) {
            return
        }
        if (aliasValue.startsWith('Square') && choices[currentAlias] === undefined) {
            dispatch(setBattlefieldMode('selection'))
        } else {
            dispatch(setBattlefieldMode('info'))
        }
    }, [currentAlias, choices, scope, dispatch, t])

    const shallowDepthScreen = useCallback(() => {
        console.log('Rendering shallow depth screen')
        const options = generateOptions()
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
                    className={styles.buttons}
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <div id={'manipulators'}>{handleDepth()}</div>
                </div>
                {options}
            </>
        )
    }, [generateOptions, handleDepth, reachedFinalDepth])

    const deepDepthScreen = useCallback(() => {
        return (
            <>
                <h1>{t('local:game.actions.you_chose')}</h1>
                {translatedChoices !== undefined ? (
                    <p>
                        {Object.entries(translatedChoices)
                            .map(([key, value]) => `${t(key)}: ${t(value)}`)
                            .join(', ')}
                    </p>
                ) : (
                    <h2>{t('local:game.actions.nothing?')}</h2>
                )}
                <RxArrowTopRight
                    onClick={() => {
                        if (choices === undefined) {
                            dispatch(
                                setChoice({
                                    key: 'action',
                                    value: 'builtins:skip',
                                })
                            )
                        }
                        setReachedFinalDepth(false)
                        dispatch(setReadyToSubmit(true))
                    }}
                />
                <BsArrowBarLeft
                    onClick={() => {
                        setReachedFinalDepth(false)
                        handleReset()
                    }}
                />
            </>
        )
    }, [dispatch, t, choices, translatedChoices, handleReset])

    useEffect(() => {
        if (!currentAlias || choices[currentAlias] === undefined || inputReadyToSubmit) {
            return
        }
        if (choices[currentAlias] !== undefined && currentAlias === 'action') {
            const choice = choices[currentAlias]
            const action = initialActionLevel.action.find((action: Action) => action.id === choice)
            if (action) {
                const nextRequirements = action.requires
                if (nextRequirements) {
                    dispatch(appendScope(nextRequirements))
                    dispatch(setCurrentAlias(Object.keys(nextRequirements)[0]))
                } else {
                    if (!reachedFinalDepth) {
                        setReachedFinalDepth(true)
                    }
                }
            } else {
                dispatch(
                    setNotify({
                        message: 'No action with given id',
                        code: 400,
                    })
                )
            }
        } else {
            // scope keeps track of requirements to process.
            // if we have chosen an action and there is another requirement in scope that haven't been defined, we move to next requirement
            // else, we set reached final depth, and it is possible to submit input
            const action = aliases[scope[currentAlias]]
            action &&
                (() => {
                    const selectedAction = action.find((action: Action) => action.id === choices[currentAlias])
                    if (selectedAction && selectedAction.requires) {
                        dispatch(appendScope(selectedAction.requires))
                    }
                })()
            const nextRequirements = Object.keys(scope).filter((key: string) => !choices[key])
            if (nextRequirements.length > 0) {
                dispatch(setCurrentAlias(nextRequirements[0]))
            } else {
                setReachedFinalDepth(true)
            }
        }
    }, [
        choices,
        currentAlias,
        scope,
        initialActionLevel.action,
        dispatch,
        handleReset,
        reachedFinalDepth,
        inputReadyToSubmit,
    ])

    return (
        <div id={'action-input'} className={styles.actionInput}>
            {isPlayerTurn ? (
                <div id={'action-confirms'}>{reachedFinalDepth ? deepDepthScreen() : shallowDepthScreen()}</div>
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
        </div>
    )
}

export default ActionInput
