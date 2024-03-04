import React, {useEffect, useState} from 'react';
import {parseBattlefield, parsedToJSX} from "./utils";
import {Battlefield as BattlefieldInterface} from "../../models/Battlefield";
import styles from "./Battlefield.module.css"

const Battlefield = (props: {
    battlefield: BattlefieldInterface
}) => {

    const battlefield = props.battlefield

    const [renderedBattlefield, setRenderedBattlefield] = useState(battlefield);
    useEffect(() => { setRenderedBattlefield(battlefield) }, [battlefield]);

    return (
        <div className={styles.battlefield} id={"battlefield-div"}>
        {parsedToJSX(parseBattlefield(renderedBattlefield))}
        </div>
    );
};

export default Battlefield;