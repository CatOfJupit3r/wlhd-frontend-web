import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'

import { BsArrowBarLeft } from 'react-icons/bs'

import { useActionContext } from '@context/ActionContext'
import { useBattlefieldContext } from '@context/BattlefieldContext'
import { useToast } from '@hooks/useToast'

import { Button } from '@components/ui/button'
import { iAction } from '@models/GameModels'
import { selectActions, selectIsYourTurn } from '@redux/slices/gameScreenSlice'
import { RxArrowTopRight } from 'react-icons/rx'
import OptionCard, { OptionCardPlaceholder, OptionCardWithLogic } from './OptionCard'

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
type ScopeOfChoice = [string, string]

const ActionInput = () => {
    const dispatch = useDispatch()
    const { setOutput } = useActionContext()
    const {
        incrementClickedSquares,
        changeOnClickTile,
        setInteractableSquares,
        resetInteractableSquares,
        resetClickedSquares,
    } = useBattlefieldContext()
    const { t } = useTranslation()
    const { toastError } = useToast()
    const actions = useSelector(selectActions)
    const isPlayerTurn = useSelector(selectIsYourTurn)
    const [currentAlias, setCurrentAlias] = useState('action')
    const { choices, resetChoices, setChoice } = useActionContext()
    const [scopeOfChoice, setScopeOfChoice] = useState<Array<ScopeOfChoice>>([['action', 'action']])
    const aliasValue = useMemo(() => {
        return scopeOfChoice.find((scope) => scope[0] === currentAlias)?.[1] ?? ''
    }, [scopeOfChoice, currentAlias])
    const action = useMemo(() => (actions && actions[aliasValue] ? actions[aliasValue] : []), [actions, aliasValue])

    const [needToAddInteractableTiles, setNeedToAddInteractableTiles] = useState<
        | {
              flag: false
              action?: iAction[]
          }
        | {
              flag: true
              action: iAction[]
          }
    >({
        flag: false,
    })

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    const options = useMemo(() => {
        return action
            .map((action: iAction, index: number) => {
                return <OptionCardWithLogic option={action} key={index} alias={currentAlias} />
            })
            .sort((a: JSX.Element, b: JSX.Element) => {
                return b?.props.option.decorations.name.localeCompare(a?.props.option.decorations.name)
            })
            .sort((a: JSX.Element) => {
                return a?.props.option.available ? -1 : 1
            })
    }, [actions, currentAlias, choices, aliasValue])

    const handleReset = useCallback(() => {
        resetInputs()
    }, [])

    const resetInputs = useCallback(() => {
        setCurrentAlias('action')
        setScopeOfChoice([['action', 'action']])
        resetChoices()
        setReachedFinalDepth(false)
        resetInteractableSquares()
        resetClickedSquares()
    }, [])

    const ResetButton = useCallback(() => {
        return (
            <Button onClick={handleReset} variant={'destructive'} className={'flex w-full flex-row gap-1'}>
                <BsArrowBarLeft className={'size-6'} />
                {t('local:game.actions.reset')}
            </Button>
        )
    }, [handleReset, t])

    const handleErrorCase = useCallback(
        (doSetOutput?: boolean) => {
            console.debug('It seems like choices is undefined. Investigate.', choices)
            if (doSetOutput) {
                setOutput({ action: 'builtins:skip' })
            }
            resetInputs()
        },
        [t, resetInputs]
    )

    const handleSend = useCallback(() => {
        if (!choices) {
            handleErrorCase()
        } else {
            setOutput(choices)
        }
        resetInputs()
    }, [choices, handleReset])

    const ConfirmButton = useCallback(() => {
        return (
            <Button onClick={handleSend} variant={'default'} className={'flex w-full flex-row gap-1'}>
                <RxArrowTopRight className={'size-6'} />
                {t('local:game.actions.submit')}
            </Button>
        )
    }, [choices, handleReset])

    const ShallowDepthScreenContent = useCallback(() => {
        if (actions === null) {
            return <h1 className={'mt-2 text-center text-t-big font-bold'}>Seems something is missing...</h1>
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
    }, [currentAlias, scopeOfChoice, actions, options, handleErrorCase, aliasValue])

    const ShallowDepthScreen = useCallback(() => {
        return (
            <>
                <div id={'buttons'} className={'flex justify-between'}>
                    <ResetButton />
                </div>
                <div id={'options'} className={'flex h-full flex-col overflow-auto'}>
                    <ShallowDepthScreenContent />
                </div>
            </>
        )
    }, [currentAlias, scopeOfChoice, actions, options])

    const FinalDepthScreen = useCallback(() => {
        return (
            <>
                <p className={'text-t-big font-bold'}>{t('local:game.actions.you_chose')}</p>
                <div className={'flex flex-col gap-2'}>
                    {choices ? (
                        scopeOfChoice.map(([key, value]) => {
                            if (value.startsWith('Square')) {
                                return null
                            }
                            if (!choices[key] || !actions) {
                                return <OptionCardPlaceholder />
                            }
                            const selected = actions[value].find((action) => action.id === choices[key])
                            if (!selected) {
                                return <OptionCardPlaceholder />
                            }
                            return <OptionCard decorations={selected.decorations} key={key} disabled={true} />
                        })
                    ) : (
                        <h2>{t('local:game.actions.nothing?')}</h2>
                    )}
                    <div className={'flex w-full flex-row justify-center gap-2'}>
                        <ResetButton />
                        <ConfirmButton />
                    </div>
                </div>
            </>
        )
    }, [dispatch, t, choices, handleReset, scopeOfChoice])

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
            setChoice(currentAlias, square)
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
        if (aliasValue.startsWith('Square')) {
            setNeedToAddInteractableTiles({
                flag: true,
                action,
            })
        }
    }, [currentAlias, aliasValue, scopeOfChoice, actions])

    useEffect(() => {
        if (actions === null || !currentAlias || choices[currentAlias] === undefined) {
            return
        }
        // scope keeps track of requirements to process.
        // if we have chosen an action and there is another requirement in scope that haven't been defined, we move to next requirement
        // else, we set reached final depth, and it is possible to submit input
        resetInteractableSquares()
        const scope = [...scopeOfChoice]
        if (action) {
            const selectedAction = action.find((action: iAction) => action.id === choices[currentAlias])
            if (selectedAction && selectedAction.requires) {
                scope.push(...Object.entries(selectedAction.requires))
            }
        }
        const nextRequirements = scope.filter(([alias]) => choices[alias] === undefined)
        if (nextRequirements.length > 0) {
            setReachedFinalDepth(false)
            const [nextAlias] = nextRequirements[0]
            setCurrentAlias(nextAlias)
            setScopeOfChoice(scope)
        } else {
            console.log('Reached final depth')
            setReachedFinalDepth(true)
        }
    }, [choices, currentAlias, scopeOfChoice, aliasValue, actions])

    return (
        <div id={'action-input'} className={'h-full w-full overflow-y-auto overflow-x-hidden px-5 pb-5'}>
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
