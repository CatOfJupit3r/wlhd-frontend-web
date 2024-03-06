import React from 'react';
import {parseBattlefield, parsedToJSX} from "./utils";
import styles from "./Battlefield.module.css"
import {useSelector} from "react-redux";
import {selectCurrentBattlefield} from "../../redux/slices/infoSlice";
import {Blurhash} from "react-blurhash";
import {BATTLEFIELD_BLUR_HASH} from "../../config/configs";

const Battlefield = () => {

    const battlefield = useSelector(selectCurrentBattlefield)

    return (
        <div className={styles.battlefield} id={"battlefield-div"}>
            {!battlefield ?
                <Blurhash hash={BATTLEFIELD_BLUR_HASH} width={64 * 8} height={64 * 9} />
                :
                parsedToJSX(parseBattlefield(battlefield))
            }
        </div>
    );
};

export default Battlefield;