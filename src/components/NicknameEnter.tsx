import React, { useState } from 'react';

const NicknameEnter: React.FC = () => {
    const [nickname, setNickname] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const text = () => {
        return isSubmitted ? "Welcome, " + nickname + "!" : "Enter your username!";
    }

    return (
        <div>
            <h1>{text()}</h1>
            <input type="text" value={nickname} onChange={
                (e) => isSubmitted ? null : setNickname(e.target.value)
            } />
            <button onClick={() => setIsSubmitted(true)}>Submit</button>
        </div>
    );
};

export default NicknameEnter;