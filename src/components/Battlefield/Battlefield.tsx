import React from 'react';
import example from "../../data/example_bf.json"
import {battlefieldStyle} from "./styles";
import {parseBattlefield, parsedToJSX} from "./utils";

const Battlefield = () => {

    return (
        <div style={battlefieldStyle}>
            {
                parsedToJSX(parseBattlefield(example))
            }
        </div>
    );
};

export default Battlefield;