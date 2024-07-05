import useIsLoggedIn from '@hooks/useIsLoggedIn'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import paths from '@router/paths'
import AuthManager from '@services/AuthManager'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Header = ({ includeLobbyRoute }: { includeLobbyRoute?: boolean }) => {
    const { isLoggedIn } = useIsLoggedIn()
    const lobbyId = useSelector(selectLobbyId)

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
                {includeLobbyRoute && lobbyId && (
                    <Link to={paths.lobbyRoom.replace(':lobbyId', lobbyId)} relative={'path'}>
                        Lobby
                    </Link>
                )}
                <Link
                    to={'.'}
                    className={'hover:text-red-800'}
                    onClick={(e) => {
                        e.preventDefault()
                        AuthManager.logout()
                    }}
                >
                    Logout
                </Link>
            </>
        )
    }, [lobbyId])

    const Navigation = useCallback(() => {
        return (
            <nav
                id={'header-nav'}
                className={`flex justify-between gap-3 pr-5 text-white max-[512px]:flex-col max-[512px]:overflow-x-auto max-[512px]:pr-0
                    max-[512px]:align-middle`}
            >
                {isLoggedIn ? <LoggedInLinks /> : <AuthLinks />}
            </nav>
        )
    }, [LoggedInLinks, AuthLinks, isLoggedIn])

    return (
        <header
            className={`relative top-0 flex w-full justify-between bg-black p-4 text-t-normal text-white max-[512px]:flex-col
                max-[512px]:justify-center max-[512px]:gap-3 max-[512px]:bg-black max-[512px]:p-4 max-[512px]:text-center
                max-[512px]:align-middle`}
        >
            <Link to="." relative={'route'} id={'header-logo'} className={'font-bold text-white no-underline'}>
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
