import { useCallback } from 'react'
import { RiVipCrownLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { LobbyInformation } from '../../../models/APIData'
import styles from './LobbyRedirect.module.css'

const LobbyRedirect = ({ info }: { info: LobbyInformation }) => {
    const { name, isGm, assignedCharacter, _id } = info

    const LinkToLobby = useCallback(() => {
        return <Link to={`../lobby-room/${_id}`} style={{
            fontSize: 'var(--text-size-normal)',
        }}>{name}</Link>
    }, [_id, name])

    const Icon = useCallback(() => {
        return (
            <div className={styles.gmIcon}>
                <RiVipCrownLine />
            </div>
        )
    }, [])

    return (
        <div className={styles.lobbyInfoContainer}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
                {isGm ? <Icon /> : null}
                <LinkToLobby />
            </div>
            <p
                style={{
                    fontSize: 'var(--text-size-small)',
                    margin: '0',
                }}
            >
                {
                    assignedCharacter ? `Playing as ${assignedCharacter}` : 'No character assigned'
                }
            </p>
        </div>
    )
}

export default LobbyRedirect
