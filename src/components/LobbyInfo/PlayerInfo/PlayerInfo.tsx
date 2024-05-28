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
                    {players.map(({player, character}, index) => (
                        <li key={index}>
                            {player.nickname} ({character?.name || 'No character'})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PlayerInfo;