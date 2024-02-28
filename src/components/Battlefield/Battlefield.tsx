import React from 'react';
import example from "../../data/example_bf.json"
import {battlefieldStyle} from "./styles";
import {parseBattlefield, parsedToJSX} from "./utils";
import {Battlefield as BattlefieldInterface} from "../../types/Battlefield";
import {useDispatch} from "react-redux";
import {setIsTurnActive} from "../../redux/slices/turnSlice";

const Battlefield = () => {

    const dispatch = useDispatch()

    const changeBattlefield = () => {
        dispatch(setIsTurnActive({flag: true}))
    }

    return (
        <div style={battlefieldStyle}>
            {
                parsedToJSX(parseBattlefield(example as BattlefieldInterface))
            }
            <button onClick={() => changeBattlefield()}>Start turn</button>
        </div>
    );
};

export default Battlefield;