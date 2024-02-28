import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {setError} from "../redux/slices/errorSlice";

const NicknameEnter: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [nickname, setNickname] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const nicknameCheck = () => {
        if (nickname === "") {
            dispatch(setError({message: "Nickname cannot be empty!"}))
            return false;
        }
        return true;
    }

    const text = () => {
        return isSubmitted ? "Welcome, " + nickname + "!" : "Enter your username!";
    }

    const save = () => (
        nicknameCheck() ? setIsSubmitted(true) : null
    )

    const submit = () => (
        nicknameCheck()
            ?
            (() => {setIsSubmitted(true); navigate("/login?nickname=" + nickname)})()
            :
            null
    )

    const clear = () => {
        setIsSubmitted(false);
        setNickname("");
    }

    return (
        <div>
            <h1>{text()}</h1>
            <input type="text" value={nickname} onChange={
                (e) => setNickname(e.target.value)
            } />
            <button onClick={() => save()}>Save</button>
            {
                isSubmitted ?
                    <>
                        <br/>
                        <button onClick={() => clear()}>Clear</button>
                        <button onClick={() => submit()}>Submit</button>
                    </> : null
            }
        </div>
    );
};

export default NicknameEnter;