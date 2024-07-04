import LobbyInfo from '@components/LobbyInfo/LobbyInfo'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useSelector } from 'react-redux'

const LobbyPage = () => {
    const lobbyInfo = useSelector(selectLobbyInfo)

    return lobbyInfo.lobbyId ? (
        <LobbyInfo />
    ) : (
        <div>
            <h1>Loading...</h1>
        </div>
    )
}

export default LobbyPage
