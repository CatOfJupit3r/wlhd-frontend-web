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
    selectEntityActions, selectReadyToSubmit,
    selectScope,
    setChoice,
    setCurrentAlias,
    setScope, setSquareChoice,
    setTranslatedChoice

} from "../../redux/slices/turnSlice";

import {useTranslation} from "react-i18next";

import {
    BsArrowBarLeft
} from "react-icons/bs";

import ActionCard from "./ActionCard";


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

    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)

    const handleReset = useCallback(() => {
        dispatch(resetInput())
    }, [dispatch, initialActionLevel.root])

    const handleDepth = (): JSX.Element => {
        return currentAlias && currentAlias !== "root" ?
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
                    key: aliasesTranslations[currentAlias],
                    value: chosenActionStore.translatedActionValue
                })
            )
            dispatch(
                setChoice({
                    key: currentAlias,
                    value: chosenActionStore.chosenActionValue
                })
            )
            dispatch(resetChosenAction())
        }
    }, [chosenActionStore]);

    const generateOptions = useCallback((): JSX.Element | JSX.Element[] => {
        let action: Action[] = []
        let aliasValue = ""
        if (currentAlias) {
            if (currentAlias === "root") {
                action = initialActionLevel.root
            } else {
                aliasValue = scope[currentAlias]
                action = aliases[aliasValue]
            }
        }

        if (!action || action.length === 0) {
            // add protocol to auto skip in this case and display error
            return <h1>{t("local:game.actions.no_available_actions")}</h1>
        }

        if (aliasValue.startsWith("Square")) {
            dispatch(setSquareChoice(true))
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
    }, [t, currentAlias, aliases])

    // const finalDepthScreen = () => {
    //     return (
    //         <>
    //             <h1>{t("local:game.actions.you_chose")}</h1>
    //             {
    //                 displayedActions !== undefined ?
    //                     <p>
    //                         {
    //                         Object.entries(displayedActions)
    //                                 .map(([key, value]) => `${t(cmdToTranslation(key))}: ${t(cmdToTranslation(value))}`)
    //                                 .join(', ')
    //                         }
    //                     </p>
    //                     :
    //                     <h2>{t("local:game.actions.nothing?")}</h2>
    //             }
    //             <RxArrowTopRight
    //                 onClick={() => {
    //                     if (chosenActionStore === undefined || chosenActionStore?.action === "") {
    //                         dispatch(setChosenActionStore({
    //                             key: "action",
    //                             action_value: "skip"
    //                         }))
    //                     }
    //                         dispatch(setIsTurnActive({
    //                             flag: false
    //                         }))
    //                         dispatch(setReadyToSubmit({
    //                             flag: true
    //                         }))
    //                 }}
    //             />
    //             <BsArrowBarLeft onClick={() => {
    //                 setReachedFinalDepth(false)
    //                 handleReset()
    //             }}/>
    //         </>
    //     )
    // }

    const shallowDepthScreen = () => {
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
                {generateOptions()}
            </>
        )
    }

    const deepDepthScreen = useCallback(() => {
        alert("You have reached final depth")
        alert(JSON.stringify(choices))
        // dispatch(resetInput()) // this causes infinite loop, i don't know how to fix bruh
        return <h1>
            {t("local:game.actions.no_more_actions")}
        </h1>
    }, [dispatch, t])

    useEffect( () => {
        if (!currentAlias || choices[currentAlias] === undefined) {
            return
        }
        if (choices[currentAlias] !== undefined && currentAlias === "root") {
            const choice = choices[currentAlias]
            const action = initialActionLevel.root.find((action: Action) => action.id === choice)
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
    }, [choices, currentAlias, scope, initialActionLevel.root, dispatch, handleReset])

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