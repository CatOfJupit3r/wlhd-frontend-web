import { Outlet, useParams } from 'react-router-dom'
import Header from '../components/Header/Header'
import Notify from '../components/Notify'

const LobbyPagesLayout = () => {
    const { lobbyId } = useParams()

    console.log('LobbyPagesLayout lobbyId:', lobbyId)

    return (
        <>
            <Header />
            <Notify />
            <Outlet />
        </>
    )
}

export default LobbyPagesLayout
