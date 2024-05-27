import { Link } from 'react-router-dom'
import paths from '../../../router/paths'
import styles from './YourCharacter.module.css'
import {selectLobbyInfo} from "../../../redux/slices/lobbySlice";
import {useSelector} from "react-redux";

const YourCharacter = () => {
    const { controlledEntity, lobbyId } = useSelector(selectLobbyInfo)

    return (
        <div className={styles.crutch}>
            <h2>Your character</h2>
            {controlledEntity ? (
                <>
                    <Link
                        to={`${paths.viewCharacter.replace(':lobbyId', lobbyId || '')}?id=${controlledEntity.id}`}
                    >
                        {controlledEntity.name}
                    </Link>
                </>
            ) : (
                <p>No controlled entity</p>
            )}
        </div>
    )
}

export default YourCharacter
