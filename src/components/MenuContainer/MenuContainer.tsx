import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectChosenMenu } from '../../redux/slices/gameSlice'
import ActionInput from '../ActionInput/ActionInput'
import ControlledEntitiesInfo from '../ControlledEntitiesInfo/ControlledEntitiesInfo'
import GameStateFeed from '../GameStateFeed/GameStateFeed'
import GmOptionMenu from '../GmOptionMenu/GmOptionMenu'
import styles from './MenuContainer.module.css'

const MenuContainer = () => {
    const chosenMenu = useSelector(selectChosenMenu)
    const { t } = useTranslation()

    const menus = useMemo(
        () => [
            {
                key: 'your-entities',
                Component: () => <ControlledEntitiesInfo />,
            },
            {
                key: 'action-select',
                Component: () => <ActionInput />,
            },
            {
                key: 'history',
                Component: () => <GameStateFeed />,
            },
            {
                key: 'gm-settings',
                Component: () => <GmOptionMenu />,
            },
        ],
        []
    )

    return chosenMenu ? (
        <div className={styles.menuContainer}>
            <h1>{t(chosenMenu)}</h1>
            {menus.find((menu) => menu.key === chosenMenu)?.Component()}
        </div>
    ) : (
        <h1>No menu chosen</h1>
    )
}

export default MenuContainer
