import Battlefield from '@components/Battlefield/Battlefield'
import GameUtilityComponent from '@components/GameScreen/GameUtilityComponent'
import TurnOrderDisplay from '@components/GameScreen/TurnOrderDisplay'
import { ActionContextProvider, iActionContext } from '@context/ActionContext'
import { BattlefieldContextProvider, useBattlefieldContext } from '@context/BattlefieldContext'
import { selectActions, selectActionTimestamp, selectBattlefield } from '@redux/slices/gameScreenSlice'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './GameScreen.module.css'
import MenuContainer from './MenuContainer/MenuContainer'
import MenuNavigator from './MenuNavigator/MenuNavigator'
import RoundHeader from './RoundHeader'

const BattlefieldSection = () => {
    const battlefield = useSelector(selectBattlefield)
    const { changeBattlefield } = useBattlefieldContext()
    const actionTimestamp = useSelector(selectActionTimestamp)

    useEffect(() => {
        changeBattlefield(battlefield)
    }, [battlefield])

    return <Battlefield separatorTimestamp={actionTimestamp} />
}

const GameScreen = ({ setActionOutput }: { setActionOutput?: iActionContext['setOutput'] }) => {
    const [chosen, setChosen] = useState<string | null>(null)
    const actions = useSelector(selectActions)

    return (
        <div className={styles.gameScreenContainer}>
            <BattlefieldContextProvider>
                <div className={styles.gameInfoContainer}>
                    <RoundHeader />
                    <div className={'flex flex-row'}>
                        <TurnOrderDisplay />
                        <BattlefieldSection />
                    </div>
                </div>
                <div className={styles.gameMenusContainer}>
                    <div className={styles.menuContainer}>
                        <ActionContextProvider actions={actions} setOutput={setActionOutput ?? ((_) => {})}>
                            <MenuContainer chosen={chosen} setChosen={setChosen} />
                        </ActionContextProvider>
                    </div>
                    <div className={styles.menuNavigation}>
                        <MenuNavigator setChosen={setChosen} />
                    </div>
                </div>
                <GameUtilityComponent />
            </BattlefieldContextProvider>
        </div>
    )
}

export default GameScreen
