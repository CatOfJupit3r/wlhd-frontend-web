import React, {useState} from 'react';
import action_example from '../../data/example_action.json';
import {Action} from "../../types/ActionInput";
import {setError} from "../../redux/slices/errorSlice";
import {useDispatch, useSelector} from "react-redux";
import {extractCards} from "./utils";
import CardGroup from 'react-bootstrap/CardGroup';


import {
    setSquareChoice,
    setChosenAction as setChosenActionStore,
    resetTurn, selectSquareChoice
} from "../../redux/slices/turnSlice";
import {Col, Row} from "react-bootstrap";


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
                    setCurrentActionLevel(
                        (actionObject.requires as Action[][])[0]
                    )
                } else if (actionObject.requires.length === 2) {
                    dispatch(setSquareChoice({flag: true}))
                } else {
                    dispatch(setError("There is an error with the action input"))
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

    const handleSelect = (e: any) => {
        const chosenActionIndex  = parseInt(e.target.value)
        if (currentActionLevel[chosenActionIndex].available) {
            setChosenAction(parseInt(e.target.value))
        }
    }

    const handleDepth = (): JSX.Element => {
        return depth === 0 ? <></> : <button onClick={handleReset} key={"reset_button"}>Reset</button>
    }

    const generateOptions = (action: Action[]): JSX.Element => {
        const indexOfLastCard = currentPage * cardsPerPage;
        const indexOfFirstCard = indexOfLastCard - cardsPerPage;
        const currentCards = action.slice(indexOfFirstCard, indexOfLastCard);

        return extractCards(currentCards, handleSelect);
    }

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
                    isSquareChoice ?
                        <h1>Choose a square</h1> // maybe instead of text, we glow the squares that are available
                        // and also this will exclude need to derender the action input (and user will be able to rethink their action)
                        :
                        <>
                            {generateOptions(currentActionLevel)}
                            <button onClick={handleConfirm}>Confirm</button>
                            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Back</button>
                            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(currentActionLevel.length / cardsPerPage)}>Forward</button>
                            {
                                handleDepth()
                            }
                        </>
            }
        </div>
    );
};

export default ActionInput;