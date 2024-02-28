import React, {useCallback, useState} from 'react';
import action_example from '../../data/example_action.json';
import {Action} from "../../types/ActionInput";
import {setError} from "../../redux/slices/errorSlice";
import {useDispatch, useSelector} from "react-redux";
import {extractCards} from "./utils";


import {
    setSquareChoice,
    setChosenAction as setChosenActionStore,
    resetTurn, selectSquareChoice, setInteractableCells
} from "../../redux/slices/turnSlice";


const ActionInput = () => {

    const [currentActionLevel, setCurrentActionLevel] = useState(action_example.actions as Action[])
    const [depth, setDepth] = useState(0)
    const [reachedFinalDepth, setReachedFinalDepth] = useState(false)
    const [chosenAction, setChosenAction] = useState(undefined as number | undefined)
    const isSquareChoice = useSelector(selectSquareChoice)
    const dispatch = useDispatch()
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
                    if (!isSquareChoice) {
                        dispatch(setSquareChoice({flag: true}))
                    }
                    dispatch(setInteractableCells({
                        lines: actionObject.requires[0].map((action: Action) => action.id),
                        columns: actionObject.requires[1].map((action: Action) => action.id)
                    }))
                } else {
                    dispatch(setError("There was an error with the action input"))
                    handleReset()
                }
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

    // const generateOptions = (action: Action[]): JSX.Element => {
    //     const indexOfLastCard = currentPage * cardsPerPage;
    //     const indexOfFirstCard = indexOfLastCard - cardsPerPage;
    //     const currentCards = action.slice(indexOfFirstCard, indexOfLastCard);
    //
    //     return extractCards(currentCards, handleSelect);
    // }

    return (
        <div>
            {
                reachedFinalDepth ?
                    <>
                        <h1>You have chosen</h1>
                        <p>
                            {
                                currentActionLevel[chosenAction as number].translation_info.descriptor
                            }
                        </p>
                    </>
                    :
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
            }
        </div>
    );
};

export default ActionInput;