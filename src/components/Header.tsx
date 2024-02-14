import React, { useState, useEffect } from 'react';
import imageSrc from '../assets/local/cat_eat.gif';

const Header: React.FC = () => {
    return (
        <header>
            <div>
                <img src={imageSrc} alt="cat" style={{
                    height: "20vw",
                    width: "100vw"
                }}/>
            </div>
        </header>
    );
};

export default Header;
