import React from 'react';
import action_example from '../../data/example_action.json';
import {ActionInput as ActionInputInterface} from "../../types/ActionInput";
import {setError} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";

action_example as ActionInputInterface;

const ActionInput = () => {

    const dispatch = useDispatch()

    const displayTest = () => {
        dispatch(setError({message: "test", code: "test"}))
    }

    return (
        <div>
            <button onClick={() => displayTest()}/>
        </div>
    );
};

export default ActionInput;