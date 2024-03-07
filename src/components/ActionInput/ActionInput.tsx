import React, {useCallback, useState} from 'react';
import {Action} from "../../models/ActionInput";
import {setNotify} from "../../redux/slices/notifySlice";
import {useDispatch, useSelector} from "react-redux";
import {extractCards} from "./utils";
import styles from "./ActionInput.module.css"

import {
    setSquareChoice,
    setChosenAction as setChosenActionStore,
    resetTurn,
    selectSquareChoice,
    setInteractableSquares,
    selectChosenSquare,
    resetInteractableSquares,
    setIsTurnActive,
    setDisplayedActions, selectDisplayedActions,
    setChosenSquare, setReadyToSubmit, selectCurrentActions, selectChosenAction
} from "../../redux/slices/turnSlice";

import {useTranslation} from "react-i18next";

import {
    BsArrowBarLeft, BsCheckSquareFill, BsSquare
} from "react-icons/bs";

import {
    TbSquareChevronLeft,
    TbSquareChevronLeftFilled,
    TbSquareChevronRight,
    TbSquareChevronRightFilled
} from "react-icons/tb";
import {cmdToTranslation} from "../../utils/cmdConverters";
import {RxArrowTopRight} from "react-icons/rx";


const ActionInput = () => {
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const isSquareChoice = useSelector(selectSquareChoice)
    const chosenSquare = useSelector(selectChosenSquare)
    const displayedActions = useSelector(selectDisplayedActions)

    const initialActionLevel = useSelector(selectCurrentActions)
    const [currentActionLevel, setCurrentActionLevel] = useState(initialActionLevel.actions)
    const [depth, setDepth] = useState(0)
    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)
    const [chosenAction, setChosenAction] = useState(undefined as number | undefined)
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, ] = useState(9);
    const chosenActionStore = useSelector(selectChosenAction)

    const incrementDepth = useCallback(() => {
        setDepth(depth + 1)
    }, [depth])

    const handleReset = useCallback(() => {
        setCurrentActionLevel(initialActionLevel.actions)
        setChosenAction(undefined)
        setDepth(0)
        dispatch(resetTurn())
    }, [dispatch, initialActionLevel.actions])

    const handleConfirm = useCallback(() => {
        if (chosenAction !== undefined) {
            incrementDepth()
            setChosenAction(undefined)
            const index = chosenAction as number
            const actionObject = currentActionLevel[index]
            dispatch (setChosenActionStore({
                key: actionObject.level,
                action_value: actionObject.id
            }))
            const {translation_info} = actionObject
            dispatch(setDisplayedActions({
                key: translation_info.level_descriptor,
                action_value: translation_info.descriptor + ":name"
            }))
            if (actionObject.requires === null) {
                setReachedFinalDepth(true)
            } else {
                if (actionObject.requires.length === 1) {
                    const newActionLevel = (actionObject.requires as Action[][])[0]
                    setCurrentActionLevel(newActionLevel)
                } else if (actionObject.requires.length === 2) {
                    // probably change line-column to square.
                    // I used this system previously due to Discord bot limitations (only 25 fields per embed)
                    // However, as support for the bot is being dropped, I can change this to a more user-friendly system
                    // Also, this will allow for a more flexible system with multiple requirements for one action (which is waaay to complex for the current implementation)
                    // But, until I change the backend, this will stay as it is.
                    dispatch(setChosenSquare({square: ""}))
                    if (!isSquareChoice) {
                        dispatch(setSquareChoice({flag: true}))
                    }
                    dispatch(setInteractableSquares({
                        lines: actionObject.requires[0].map((action: Action) => action.id),
                        columns: actionObject.requires[1].map((action: Action) => action.id)
                    }))
                } else {
                    dispatch(setNotify({
                        message: "This action requires more than 2 requirements. This is not supported yet.",
                        code: 400
                    }))
                    handleReset()
                }
            }
        } else if (chosenSquare !== "") {
            if (isSquareChoice) {
                setReachedFinalDepth(true)
                const [line, column] = chosenSquare.split("/")
                dispatch (setChosenActionStore({
                    key: "line",
                    action_value: line
                }))
                dispatch (setChosenActionStore({
                    key: "column",
                    action_value: column
                }))
                dispatch(resetInteractableSquares())
                dispatch(setSquareChoice({flag: false}))
            }
        }
    }, [chosenAction, chosenSquare, isSquareChoice, dispatch, currentActionLevel, handleReset, incrementDepth]);

    const handleDepth = (): JSX.Element => {
        return depth === 0 ? <BsArrowBarLeft/> :
            <BsArrowBarLeft onClick={() => {
                handleReset()
            }}/>
    }

    const generateOptions = useCallback((action: Action[]): JSX.Element => {
        if (!action || action.length === 0) {
            return <h1>{t("local:game.actions.no_available_actions")}</h1>
        }
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const currentCards = action.slice(indexOfFirstCard, indexOfLastCard);

        const handleSelect = (value: number) => {
            if (currentActionLevel[value].available) {
                setChosenAction(value)
            }
        }

        return extractCards(currentCards, handleSelect, handleConfirm, t, chosenAction as number)
    }, [currentPage, cardsPerPage, currentActionLevel, t, chosenAction, handleConfirm])

    const finalDepthScreen = () => {
        return (
            <>
                <h1>{t("local:game.actions.you_chose")}</h1>
                {
                    displayedActions !== undefined ?
                        <p>
                            {
                            Object.entries(displayedActions)
                                    .map(([key, value]) => `${t(cmdToTranslation(key))}: ${t(cmdToTranslation(value))}`)
                                    .join(', ')
                            }
                        </p>
                        :
                        <h2>{t("local:game.actions.nothing?")}</h2>
                }
                <RxArrowTopRight
                    onClick={() => {
                        if (chosenActionStore === undefined || chosenActionStore?.action === "") {
                            dispatch(setChosenActionStore({
                                key: "action",
                                action_value: "skip"
                            }))
                        }
                            dispatch(setIsTurnActive({
                                flag: false
                            }))
                            dispatch(setReadyToSubmit({
                                flag: true
                            }))
                    }}
                />
                <BsArrowBarLeft onClick={() => {
                    setReachedFinalDepth(false)
                    handleReset()
                }}/>
            </>
        )
    }

    const shallowDepthScreen = () => {
        return (
            <>
                {/* Will add h1 to display what current action choice is for... But I don't know how? */}
                {generateOptions(currentActionLevel)}
                <div id={"buttons"} className={styles.buttons} style={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <div id={"manipulators"}>
                        {
                            chosenAction !== undefined || chosenSquare !== "" ?
                                <BsCheckSquareFill onClick={handleConfirm}/>
                                :
                                <BsSquare onClick={handleConfirm}/>
                        }
                        {
                            handleDepth()
                        }
                    </div>
                    {
                        <div id={"action-navigation"}>
                            {
                                currentActionLevel && currentPage === Math.ceil(currentActionLevel.length / cardsPerPage) && currentPage === 1 ?
                                <>
                                    <TbSquareChevronLeft />
                                    <TbSquareChevronRight  />
                                </>
                                :
                                <>
                                    {
                                        currentActionLevel && currentPage === Math.ceil(currentActionLevel.length / cardsPerPage) ?
                                            <TbSquareChevronLeftFilled onClick={() => setCurrentPage( currentPage - 1)} />
                                            :
                                            <TbSquareChevronLeft />
                                    }
                                    {
                                        currentActionLevel && currentPage === 1 ?
                                            <TbSquareChevronRightFilled onClick={() => setCurrentPage(currentPage + 1)}/>
                                            :
                                            <TbSquareChevronRight  />
                                    }
                                </>
                            }
                        </div>
                    }
                </div>
            </>
        )
    }

    return (
        <div id={"action-input"}>
            {
                reachedFinalDepth ?
                    finalDepthScreen()
                    :
                    shallowDepthScreen()
            }
        </div>
    );
};

export default ActionInput;