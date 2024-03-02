import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setNotify} from "../redux/slices/notifySlice";
import {selectGameId, setGameId} from "../redux/slices/gameSlice";

const GameIdEnter: React.FC = () => {
    const dispatch = useDispatch();
    const gameId = useSelector(selectGameId)

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        gameId === "" ? dispatch(setNotify({message: "Game ID cannot be empty!", code: 400})) : dispatch(setGameId(e.target.value))
    }

    return (
        <div>
            <input type="text" value={gameId} onChange={
                (e) => handleInput(e)
            } />
        </div>
    );
};

export default GameIdEnter;