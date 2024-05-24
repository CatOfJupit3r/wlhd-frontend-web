import {useCallback, useState} from 'react'
import {RiVipCrownFill, RiVipCrownLine} from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { LobbyInformation } from '../../../models/APIData'
import styles from './LobbyRedirect.module.css'

const LobbyRedirect = ({ info }: { info: LobbyInformation }) => {
    const { name, isGm, _id } = info

    const LinkToLobby = useCallback(() => {
        return <Link to={`../lobby-room/${_id}`}>{name}</Link>
    }, [_id, name])

    const Icon = useCallback(() => {
        const [isHovered, setIsHovered] = useState(false)

        return <div className={styles.gmIcon} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {isHovered ? <RiVipCrownFill/> : <RiVipCrownLine />}
        </div>
    }, [])

    return (
        <div className={styles.lobbyInfoContainer}>
            {isGm ? <Icon /> : null}
            <LinkToLobby />
        </div>
    )
}

export default LobbyRedirect
