import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NicknameEnter: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const nicknameCheck = () => {
        if (nickname === "") {
            alert("Please enter a nickname");
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
            (() => {setIsSubmitted(true); navigate("/login?=" + nickname)})()
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