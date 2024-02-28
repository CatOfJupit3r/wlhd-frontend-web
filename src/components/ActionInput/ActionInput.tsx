import React, {useCallback, useState} from 'react';
import action_example from '../../data/example_action.json';
import {Action} from "../../types/ActionInput";
import {setError} from "../../redux/slices/errorSlice";
import {useDispatch, useSelector} from "react-redux";
import {extractCards} from "./utils";


import {
    setSquareChoice,
    setChosenAction as setChosenActionStore,
    resetTurn, selectSquareChoice, setInteractableSquares, selectChosenSquare, resetInteractableSquares
} from "../../redux/slices/turnSlice";


const ActionInput = () => {
    const dispatch = useDispatch()
    const isSquareChoice = useSelector(selectSquareChoice)
    const chosenSquare = useSelector(selectChosenSquare)

    const [currentActionLevel, setCurrentActionLevel] = useState(action_example.actions as Action[])
    const [depth, setDepth] = useState(0)
    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)
    const [chosenAction, setChosenAction] = useState(undefined as number | undefined)
    const [currentPage, setCurrentPage] = useState(1);
    const [cardsPerPage, ] = useState(9);

    const incrementDepth = () => {setDepth(depth + 1)}

    const handleConfirm = () => {
        if (chosenAction !== undefined) {
            incrementDepth()
            setChosenAction(undefined)
            const index = chosenAction as number
            const actionObject = currentActionLevel[index]
            dispatch (setChosenActionStore({
                key: actionObject.level,
                action_value: actionObject.id
            }))
            if (actionObject.requires === null) {
                setReachedFinalDepth(true)
            } else {
                if (actionObject.requires.length === 1) {
                    const newActionLevel = (actionObject.requires as Action[][])[0]
                    setCurrentActionLevel(
                        newActionLevel
                    )
                } else if (actionObject.requires.length === 2) {
                    // probably change line-column to square.
                    // I used this system previously due to Discord bot limitations (only 25 fields per embed)
                    // However, as support for the bot is being dropped, I can change this to a more user-friendly system
                    // Also, this will allow for a more flexible system with multiple requirements for one action (which is waaay to complex for the current implementation)
                    // But, until I change the backend, this will stay as it is.
                    if (!isSquareChoice) {
                        dispatch(setSquareChoice({flag: true}))
                    }
                    dispatch(setInteractableSquares({
                        lines: actionObject.requires[0].map((action: Action) => action.id),
                        columns: actionObject.requires[1].map((action: Action) => action.id)
                    }))
                } else {
                    dispatch(setError("There was an error with the action input"))
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
    }

    const handleReset = () => {
        setCurrentActionLevel(action_example.actions as Action[])
        setChosenAction(undefined)
        setDepth(0)
        dispatch(resetTurn())
    }

    const handleDepth = (): JSX.Element => {
        return depth === 0 ? <></> : <button onClick={handleReset} key={"reset_button"}>Reset</button>
    }

    const generateOptions = useCallback((action: Action[]): JSX.Element => {
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const currentCards = action.slice(indexOfFirstCard, indexOfLastCard);

        const handleSelect = (e: any) => {
            const chosenActionIndex  = parseInt(e.target.value)
            if (currentActionLevel[chosenActionIndex].available) {
                setChosenAction(parseInt(e.target.value))
            }
        }

        return extractCards(currentCards, handleSelect);
    }, [currentPage, cardsPerPage, currentActionLevel])

    const finalDepthScreen = () => {
        return (
            <>
                <h1>You have chosen</h1>
                <p>
                    {
                        "Stuff will happen here."
                    }
                </p>
                <button onClick={() => {
                    setReachedFinalDepth(false)
                    handleReset()
                }}>Reset</button>
            </>
        )
    }

    const shallowDepthScreen = () => {
        return (
            <>
                {generateOptions(currentActionLevel)}
                <button onClick={handleConfirm}>Confirm</button>
                {
                    currentPage === Math.ceil(currentActionLevel.length / cardsPerPage) && currentPage === 1 ?
                        <></>
                        :
                        <>
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Back</button>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(currentActionLevel.length / cardsPerPage)}>Forward</button>
                        </>
                }
                {
                    handleDepth()
                }
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