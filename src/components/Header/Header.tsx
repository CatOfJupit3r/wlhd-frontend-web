import React from 'react'
import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import AuthManager from '../../services/AuthManager'
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn'


const Header = () => {
    const isLoggedIn = useIsLoggedIn()

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
                {/* TODO: make game state clean when outside of game page */}
                <Link to="." relative={'route'} style={{ marginRight: '10px' }}>
                    Home
                </Link>
                <Link to="about" relative={'path'} style={{ marginRight: '10px' }}>
                    About
                </Link>
                {isLoggedIn ? (
                    <>
                        <Link to="profile" relative={'path'} style={{ marginRight: '10px' }}>
                            Profile
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                AuthManager.logout()
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="login" relative={'path'} style={{ marginRight: '10px' }}>
                            Login
                        </Link>
                        <Link to="register" relative={'path'}>
                            Register
                        </Link>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
