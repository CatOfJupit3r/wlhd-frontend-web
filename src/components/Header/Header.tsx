import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import AuthManager from '../../services/AuthManager'

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <p
                style={{
                    display: 'flex',
                }}
            >
                Walenholde
            </p>
            {/* you served well, o' feline. For this, you will be engraved here until the end of times. */}
            {/*<img src={"assets/local/cat_eat.gif"} alt="cat" style={{*/}
            {/*    height: "400px",*/}
            {/*    width: "100%"*/}
            {/*}}/>*/}
            <nav>
                {' '}
                {/* TODO: when navigating to other routes outside of game, then previous state is saved */}
                <Link to="login" relative={'path'} style={{ marginRight: '10px' }}>
                    Login
                </Link>
                <Link to="register" relative={'path'} style={{ marginRight: '10px' }}>
                    Register
                </Link>
                <Link to="." relative={'route'} style={{ marginRight: '10px' }}>
                    Home
                </Link>
                <Link to="about" relative={'path'}>
                    About
                </Link>
                <button onClick={(e) => {
                    e.preventDefault()
                    AuthManager.logout()
                }}>
                    Logout
                </button>
            </nav>
        </header>
    )
}

export default Header
