import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <p style={{
                display: "flex",
            }}>Walenholde</p>
            {/* you served well, o' feline. For this, you will be engraved here until the end of times. */}
            {/*<img src={"assets/local/cat_eat.gif"} alt="cat" style={{*/}
            {/*    height: "400px",*/}
            {/*    width: "100%"*/}
            {/*}}/>*/}
            <nav> {/* TODO: when navigating to other routes outside of game, then previous state is saved */}
                <Link to="." relative={"route"} style={{marginRight: "10px"}}>Home</Link>
                <Link to="about" relative={"path"}>About</Link>
            </nav>
        </header>
    );
};

export default Header;
