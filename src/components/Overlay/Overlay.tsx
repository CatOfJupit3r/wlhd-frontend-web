import React from 'react';
import styles from "./Overlay.module.css";

const Overlay = (props: {
    children?: React.ReactNode,
}
) => {
    return (
        <div className={styles.overlay} id={"overlay-screen"}>
            <div id={"info"} className={styles.container}>
                {props.children}
            </div>
        </div>
    );
};

export default Overlay;