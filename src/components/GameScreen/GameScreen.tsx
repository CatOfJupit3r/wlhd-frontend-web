import Battlefield from '../Battlefield/Battlefield'
import styles from './GameScreen.module.css'
import MenuContainer from './MenuContainer/MenuContainer'
import MenuNavigator from './MenuNavigator/MenuNavigator'
import RoundHeader from './RoundHeader'
import TurnOrderDisplay from '@components/GameScreen/TurnOrderDisplay'

const GameScreen = () => {
    return (
        <div className={styles.gameScreenContainer}>
            <div className={styles.gameInfoContainer}>
                <RoundHeader />
                <div className={'flex flex-row'}>
                    <TurnOrderDisplay />
                    <Battlefield />
                </div>
            </div>
            <div className={styles.gameMenusContainer}>
                <div className={styles.menuContainer}>
                    <MenuContainer />
                </div>
                <div className={styles.menuNavigation}>
                    <MenuNavigator />
                </div>
            </div>
        </div>
    )
}

export default GameScreen
