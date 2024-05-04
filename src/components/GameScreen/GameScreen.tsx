import React from 'react'
import RoundHeader from './RoundHeader'
import Battlefield from '../Battlefield/Battlefield'
import styles from './GameScreen.module.css'
import MenuContainer from './MenuContainer/MenuContainer'
import MenuNavigator from './MenuNavigator/MenuNavigator'

const GameScreen = () => {
    return (
        <div className={styles.gameScreenContainer}>
            <div className={styles.gameInfoContainer}>
                <RoundHeader />
                <Battlefield mode={'game'} />
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
