import LobbyInformation from '@components/LobbyInformation/LobbyInformation'
import PseudoLobbyInfo from '@components/LobbyInformation/PseudoLobbyInfo'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useSelector } from 'react-redux'

const LobbyPage = () => {
    const lobbyInfo = useSelector(selectLobbyInfo)

    return lobbyInfo.lobbyId ? <LobbyInformation info={lobbyInfo} /> : <PseudoLobbyInfo />
}

export default LobbyPage
