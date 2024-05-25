import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import useIsLoggedIn from '../../hooks/useIsLoggedIn'
import paths from '../../router/paths'
import AuthManager from '../../services/AuthManager'
import styles from './Header.module.css'

const Header = () => {
    const { isLoggedIn } = useIsLoggedIn()

    const AuthLinks = useCallback(() => {
        return (
            <>
                <Link to={paths.signIn} relative={'path'}>
                    Sign In
                </Link>
                <Link to={paths.signUp} relative={'path'}>
                    Sign Up
                </Link>
            </>
        )
    }, [])

    const LoggedInLinks = useCallback(() => {
        return (
            <>
                <Link to={paths.profile} relative={'path'}>
                    Profile
                </Link>
                <Link
                    to={'.'}
                    onClick={(e) => {
                        e.preventDefault()
                        AuthManager.logout()
                    }}
                >
                    Logout
                </Link>
            </>
        )
    }, [])

    const Navigation = useCallback(() => {
        return <nav id={'header-nav'}>{isLoggedIn ? <LoggedInLinks /> : <AuthLinks />}</nav>
    }, [isLoggedIn])

    return (
        <header className={styles.header}>
            <Link
                to="."
                relative={'route'}
                id={'header-logo'}
                style={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: 'white',
                }}
            >
                Walenholde
            </Link>
            {/* you served well, o' feline. For this, you will be engraved here until the end of times. */}
            {/*<img src={"assets/local/cat_eat.gif"} alt="cat" style={{*/}
            {/*    height: "400px",*/}
            {/*    width: "100%"*/}
            {/*}}/>*/}
            <Navigation />
        </header>
    )
}

export default Header
