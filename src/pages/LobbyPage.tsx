import { useSelector } from 'react-redux'
import PlayerInfo from '../components/LobbyInfo/PlayerInfo/PlayerInfo'
import YourCharacter from '../components/LobbyInfo/YourCharacter/YourCharacter'
import { selectLobbyInfo } from '../redux/slices/lobbySlice'
import CombatInfo from "../components/LobbyInfo/CombatInfo/CombatInfo";

const LobbyPage = () => {
    const lobbyInfo = useSelector(selectLobbyInfo)

    return lobbyInfo.lobbyId ? (
        <div>
            <PlayerInfo />
            <CombatInfo />
            <YourCharacter />
        </div>
    ) : (
        <div>
            <h1>Loading...</h1>
        </div>
    )
}

export default LobbyPage
