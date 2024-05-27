import styles from './PlayerInfo.module.css'
import {useSelector} from "react-redux";
import {selectLobbyInfo} from "../../../redux/slices/lobbySlice";

const PlayerInfo = () => {
    const { players } = useSelector(selectLobbyInfo);
    
    return (
        <div>
            <h2 className={styles.crutch}>Players</h2>
            {players && players.length === 0 ? (
                <p>No players</p>
            ) : (
                <ul>
                    {players.map((player) => (
                        <li key={player.userId}>
                            {player.nickname} ({player.mainCharacter})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerInfo;