import React from 'react';
import {useSelector} from "react-redux";
import {selectRound} from "../../redux/slices/infoSlice";

const RoundHeader = () => {
    const round = useSelector(selectRound)

    return (
        <div>
            <h1>Round {round}</h1>
        </div>
    )
}

export default RoundHeader
