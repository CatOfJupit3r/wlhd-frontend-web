import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header>
            <img src={"assets/local/cat_eat.gif"} alt="cat" style={{
                height: "20vw",
                width: "100vw"
            }}/>
            <nav>
                <Link to="." relative={"route"}>Home </Link>
                <Link to="about" relative={"path"}>About</Link>
            </nav>
        </header>
    );
};

export default Header;
