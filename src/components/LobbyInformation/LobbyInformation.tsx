import { iLobbyInformation } from '@models/Redux'
import { FC } from 'react'
import ActiveCombatsList from './ActiveCombatsList'
import CharactersInLobby from './CharactersInLobby'
import LobbyInformationHeader from './LobbyInformationHeader'
import PlayersList from './PlayersList'

interface iLobbyInformationProps {
    info: iLobbyInformation
}

const LobbyInformation: FC<iLobbyInformationProps> = ({
    info: { name, players, combats, layout, lobbyId, characters },
}) => {
    return (
        <div className={'mx-auto flex w-full flex-col space-y-6 p-4 lg:max-w-[1400px]'}>
            <LobbyInformationHeader header={name} />
            <div className={'grid grid-cols-1 gap-6 md:grid-cols-2'}>
                <PlayersList className={'col-span-1'} players={players} layout={layout} />
                <ActiveCombatsList className={'col-span-1'} combats={combats} layout={layout} lobbyId={lobbyId} />
            </div>
            <CharactersInLobby characters={characters} lobbyId={lobbyId} />
        </div>
    )
}

export default LobbyInformation
