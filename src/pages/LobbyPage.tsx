import LobbyInformation from '@components/LobbyInformation/LobbyInformation'
import PseudoLobbyInfo from '@components/LobbyInformation/PseudoLobbyInfo'
import useThisLobby from '@queries/useThisLobby'

const LobbyPage = () => {
    const { lobby, isLoading, isInLobbyPage, isError } = useThisLobby()

    return isInLobbyPage && !isLoading && !isError ? <LobbyInformation info={lobby} /> : <PseudoLobbyInfo />
}

export default LobbyPage
