import React from 'react';
import {parseBattlefield, parsedToJSX} from "./utils";
import styles from "./Battlefield.module.css"
import {useSelector} from "react-redux";
import {selectCurrentBattlefield} from "../../redux/slices/infoSlice";

const Battlefield = () => {

    const battlefield = useSelector(selectCurrentBattlefield)

    return (
        <div className={styles.battlefield} id={"battlefield-div"}>
            {parsedToJSX(parseBattlefield(battlefield))}
        </div>
    );
};

export default Battlefield;