import { CharacterInLobby, LobbyPlayerInfo } from '@models/Redux'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './PlayerInfo.module.css'

const PlayerInfo = ({ className }: { className: string }) => {
    const { players, characters } = useSelector(selectLobbyInfo)

    const CharactersToLinks = useCallback((characters: Array<CharacterInLobby>) => {
        return characters.map((value, index) => (
            <Link to={`./view-character?character=${value.descriptor}`} key={index}>
                {value.decorations.name} (@{value.descriptor})
            </Link>
        ))
    }, [])

    const Player = useCallback(
        ({ player }: { player: LobbyPlayerInfo }) => {
            return (
                <div className={styles.player}>
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
                                {CharactersToLinks(
                                    characters.filter((char) => player.characters.includes(char.descriptor))
                                ).map((value, index, array) => (
                                    <span key={index}>
                                        {value}
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
        },
        [players]
    )

    return (
        <div className={className.concat(` ${styles.playerInfoContainer}` || '')}>
            <h1>Players</h1>
            {players && players.length === 0 ? (
                <p>No players</p>
            ) : (
                <div className={styles.playerContainer}>
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
    )
}

export default PlayerInfo
