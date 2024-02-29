import React from 'react';
import {useSelector} from "react-redux";
import {selectIsTurnActive} from "../../redux/slices/turnSlice";
import Battlefield from "../Battlefield/Battlefield";
import ActionInput from "../ActionInput/ActionInput";

const GameScreen = () => {
    const isTurn = useSelector(selectIsTurnActive)

    return (
        <div id={"game-controller"} style={{
            display: "flex",
        }}>
            <Battlefield />
            {isTurn ?
                <ActionInput />
                :
                <h1>Not your turn!</h1>}
        </div>
    )
};

export default GameScreen;