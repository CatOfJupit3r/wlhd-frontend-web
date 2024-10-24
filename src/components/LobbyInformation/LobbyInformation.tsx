import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card'
import { LobbyState } from '@models/Redux'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Player = ({ player }: { player: LobbyState['players'][number] }) => {
    const { characters } = useSelector(selectLobbyInfo)

    return (
        <div>
            <img src={'https://placehold.co/50x50'} alt={player.nickname} />
            <div>
                <p>
                    {player.nickname} (@{player.handle})
                </p>
                {player.characters.length ? (
                    <span
                        style={{
                            fontSize: 'var(--text-size-small)',
                            margin: '0',
                            color: 'gray',
                        }}
                    >
                        Playing as{' '}
                        {characters
                            .filter((char) => player.characters.includes(char.descriptor))
                            .map((value, index, array) => (
                                <span key={index}>
                                    <Link to={`./view-character?character=${value.descriptor}`} key={index}>
                                        {value.decorations.name} (@{value.descriptor})
                                    </Link>
                                    {index === array.length - 1 ? '.' : ', '}
                                </span>
                            ))}
                    </span>
                ) : (
                    <span>No character assigned</span>
                )}
            </div>
        </div>
    )
}

const LobbyInformation = () => {
    const { name, players } = useSelector(selectLobbyInfo)

    return (
        <div className="flex justify-center bg-gradient-to-br p-4">
            <Card className="relative w-full max-w-7xl shadow-2xl">
                <CardHeader>
                    <CardTitle className={'text-center'}>{name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div id={'players'}>
                        <p className="text-t-big font-semibold">Players</p>
                        <div>
                            {players && players.length === 0 ? (
                                <p>No players</p>
                            ) : (
                                <div>
                                    {players && players.length !== 0 ? (
                                        players.map((info, index) => <Player player={info} key={index} />)
                                    ) : (
                                        <div>
                                            <p>There are no players in this lobby</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div id={'combats'}>
                        <p className="text-t-big font-semibold">Combats</p>
                    </div>
                    <div id={'characters'}>
                        <p className="text-t-big font-semibold">Characters</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LobbyInformation
