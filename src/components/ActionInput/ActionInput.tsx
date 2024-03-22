import React, {useCallback, useEffect, useState} from 'react';
import {Action} from "../../models/ActionInput";
import {setNotify} from "../../redux/slices/notifySlice";
import {useDispatch, useSelector} from "react-redux";
import styles from "./ActionInput.module.css"

import {
    resetChosenAction,
    resetInput, selectAliases,
    selectAliasTranslations,
    selectChoices, selectChosenAction,
    selectCurrentAlias,
    selectEntityActions, selectIsSquareChoice,
    selectScope, selectTranslatedChoices,
    setChoice,
    setCurrentAlias, setReadyToSubmit,
    setScope, setSquareChoice,
    setTranslatedChoice

} from "../../redux/slices/turnSlice";

import {useTranslation} from "react-i18next";

import {
    BsArrowBarLeft
} from "react-icons/bs";

import ActionCard from "./ActionCard";
import {RxArrowTopRight} from "react-icons/rx";


/*

When we choose item inside select or square, it is written to current choices in format:

choices[currentAlias]: chosenValue
translatedChoices[aliasesTranslations[currentAlias]]: chosenValueTranslation

ActionInput then listens to changes in choices and if currentAlias is not empty, it moves to next requirement in scope

 */


const ActionInput = () => {
    const dispatch = useDispatch()
    const {t} = useTranslation()

    const initialActionLevel = useSelector(selectEntityActions)
    const currentAlias = useSelector(selectCurrentAlias)
    const aliasesTranslations = useSelector(selectAliasTranslations)
    const choices = useSelector(selectChoices)
    const scope = useSelector(selectScope)
    const aliases = useSelector(selectAliases)
    const chosenActionStore = useSelector(selectChosenAction)
    const translatedChoices = useSelector(selectTranslatedChoices)
    const isSquareChoice = useSelector(selectIsSquareChoice)

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    const handleReset = useCallback(() => {
        dispatch(resetInput())
    }, [dispatch])

    const handleDepth = (): JSX.Element => {
        return currentAlias && currentAlias !== "action" ?
            <BsArrowBarLeft onClick={() => handleReset()}/>
            :
            <BsArrowBarLeft />
    }

    useEffect(() => {
        if (chosenActionStore && chosenActionStore.chosenActionValue !== "" && chosenActionStore.translatedActionValue !== "") {
            dispatch(setNotify({
                message: chosenActionStore.translatedActionValue,
                code: 200
            }))
            dispatch(
                setTranslatedChoice({
                    key: t(
                        currentAlias && currentAlias !== "action" ?
                            aliasesTranslations[scope[currentAlias]]
                            :
                            aliasesTranslations[currentAlias]
                    ),
                    value: chosenActionStore.translatedActionValue
                })
            )
            dispatch(
                setChoice({
                    key: currentAlias,
                    value: chosenActionStore.chosenActionValue
                })
            )
            if (isSquareChoice) {
                dispatch(setSquareChoice(false))
            }
            dispatch(resetChosenAction())
        }
    }, [chosenActionStore, dispatch, t, aliasesTranslations, currentAlias, isSquareChoice, scope]);

    const generateOptions = useCallback((): JSX.Element | JSX.Element[] => {
        let action: Action[] = []
        let aliasValue = ""
        if (currentAlias) {
            if (currentAlias === "action") {
                action = initialActionLevel.action
            } else {
                aliasValue = scope[currentAlias]
                action = aliases[aliasValue]
            }
        }

        if (!action || action.length === 0) {
            // add protocol to auto skip in this case and display error
            dispatch(resetInput())
            return [<h1>{t("local:game.actions.no_available_actions")}</h1>]
        }

        if (aliasValue.startsWith("Square") && choices[currentAlias] === undefined) {
            return <h1>
                {t("local:game.actions.choose_square")}
            </h1>
        }

        return action.map((action: Action, index: number) => {
            return (
                <ActionCard
                    option={action}
                    index={index}
                    t={t}
                    key={index}
                />
            )
        })
    }, [t, currentAlias, aliases, scope, choices, initialActionLevel.action])

    useEffect(() => {
        const aliasValue = scope[currentAlias]
        if (!currentAlias || aliasValue === undefined) {
            return
        }
        if (aliasValue.startsWith("Square") && choices[currentAlias] === undefined) {
            dispatch(setSquareChoice(true))
        } else {
            dispatch(setSquareChoice(false))
        }
    }, [currentAlias, choices, scope, dispatch, t])

    const shallowDepthScreen = () => {
        const options = generateOptions()
        if (Array.isArray(options)) {
            options.sort((a) => {
                return a.props.option.available ? -1 : 1
            })
        }
        return (
            <>
                <div id={"buttons"} className={styles.buttons} style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <div id={"manipulators"}>
                        {
                            handleDepth()
                        }
                    </div>
                </div>
                {options}
            </>
        )
    }

    const deepDepthScreen = useCallback(() => {
        return (
            <>
                <h1>{t("local:game.actions.you_chose")}</h1>
                {
                    translatedChoices !== undefined ?
                        <p>
                            {
                            Object.entries(translatedChoices)
                                    .map(([key, value]) => `${t(key)}: ${t(value)}`)
                                    .join(', ')
                            }
                        </p>
                        :
                        <h2>{t("local:game.actions.nothing?")}</h2>
                }
                <RxArrowTopRight
                    onClick={() => {
                        if (choices === undefined) {
                            dispatch(setChoice({
                                key: "action",
                                value: "builtins:skip"
                            }))
                        }
                        dispatch(setReadyToSubmit(true))
                    }
                    }
                />
                <BsArrowBarLeft onClick={() => {
                    setReachedFinalDepth(false)
                    handleReset()
                }}/>
            </>
        )
    }, [dispatch, t, choices, translatedChoices, handleReset])

    useEffect( () => {
        if (!currentAlias || choices[currentAlias] === undefined) {
            return
        }
        if (choices[currentAlias] !== undefined && currentAlias === "action") {
            const choice = choices[currentAlias]
            const action = initialActionLevel.action.find((action: Action) => action.id === choice)
            if (action) {
                const nextRequirements = action.requires
                if (nextRequirements) {
                    dispatch(setScope(nextRequirements))
                    dispatch(setCurrentAlias(Object.keys(nextRequirements)[0]))
                } else {
                    if (!reachedFinalDepth) {
                        setReachedFinalDepth(true)
                    }
                }
            }
            else {
                dispatch(setNotify({
                    message: "No action with given id",
                    code: 400
                }))
            }
        } else {
            // in scope is declared requirements.
            // if we have chosen an action and there is a another requirement in scope that haven't been defined, we move to next requirement
            // else, we set readyToSubmit to true
            const nextRequirements = Object.keys(scope).filter(
                (key: string) => !choices[key]
            )
            if (nextRequirements.length > 0) {
                dispatch(setCurrentAlias(nextRequirements[0]))
            } else {
                setReachedFinalDepth(true)
            }
        }
    }, [choices, currentAlias, scope, initialActionLevel.action, dispatch, handleReset, reachedFinalDepth])

    return (
        <div id={"action-input"} style={{
            width: 64*7 + "px",
            height: 64*9 + "px",
            borderRadius: "10px",
            backgroundColor: "lightgray",
            marginLeft: "25px",
            overflowY: "scroll",
            overflowX: "hidden",
            padding: "10px",
            paddingRight: "20px",
            paddingLeft: "20px",
        }}>
            <div id={"action-confirms"}>
                {
                    reachedFinalDepth ?
                    deepDepthScreen()
                        :
                    shallowDepthScreen()
                }
            </div>
        </div>
    );
};

export default ActionInput;