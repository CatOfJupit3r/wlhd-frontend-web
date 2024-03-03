import React, {useEffect, useState} from 'react';
import {battlefieldStyle} from "./styles";
import {parseBattlefield, parsedToJSX} from "./utils";
import {Battlefield as BattlefieldInterface} from "../../types/Battlefield";

const Battlefield = (props: {
    battlefield: BattlefieldInterface
}) => {

    const battlefield = props.battlefield

    const [renderedBattlefield, setRenderedBattlefield] = useState(battlefield);
    useEffect(() => { setRenderedBattlefield(battlefield) }, [battlefield]);

    return (
        <div style={battlefieldStyle}>
        {parsedToJSX(parseBattlefield(renderedBattlefield))}
        </div>
    );
};

export default Battlefield;