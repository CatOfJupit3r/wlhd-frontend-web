import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { CharacterInLobby, LobbyPlayerInfo } from '@models/Redux'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import styles from './PlayerInfo.module.css'

const PlayerInfo = ({ className }: { className: string }) => {
    const { players } = useSelector(selectLobbyInfo)

    const CharactersToLinks = useCallback((characters: Array<CharacterInLobby>) => {
        return characters.map((value, index) => (
            <Link to={`./view-character?character=${value.descriptor}`} key={index}>
                {value.name} (@{value.descriptor})
            </Link>
        ))
    }, [])

    const Player = useCallback(
        ({ info }: { info: LobbyPlayerInfo }) => {
            const { player, characters } = info
            return (
                <div className={styles.player}>
                    <img src={'https://placehold.co/50x50'} alt={player.nickname} />
                    <div>
                        <p>
                            {player.nickname} (@{player.handle})
                        </p>
                        {characters.length ? (
                            <span
                                style={{
                                    fontSize: 'var(--text-size-small)',
                                    margin: '0',
                                    color: 'gray',
                                }}
                            >
                                Playing as{' '}
                                {CharactersToLinks(characters).map((value, index, array) => (
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
                        players.map((info, index) => <Player info={info} key={index} />)
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
