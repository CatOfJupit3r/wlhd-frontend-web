import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { LobbyPlayerInfo } from '../../../models/Redux'
import { selectLobbyInfo } from '../../../redux/slices/lobbySlice'
import styles from './PlayerInfo.module.css'
import ElementWithIcon from '../../ElementWithIcon/ElementWithIcon'

const PlayerInfo = ({ className }: { className: string }) => {
    const { players } = useSelector(selectLobbyInfo)

    const Player = useCallback(({ info }: { info: LobbyPlayerInfo }) => {
        const { player, character } = info
        return (
            <div className={styles.player}>
                <ElementWithIcon
                    element={
                        <p>
                            {player.nickname} (@{player.handle})
                        </p>
                    }
                    icon={<img src={'https://placehold.co/50x50'} alt={player.nickname} />}
                ></ElementWithIcon>

                {character && (
                    <ElementWithIcon
                        element={
                            <p>
                                {character.name}
                            </p>
                        }
                        icon={<img src={'https://placehold.co/50x50'} alt={character.name} />}
                    ></ElementWithIcon>
                )}
            </div>
        )
    }, [])

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
