import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ActionInput from '../ActionInput/ActionInput'
import ControlledEntitiesInfo from '../ControlledEntitiesInfo/ControlledEntitiesInfo'
import GameMessagesFeed from '../GameMessagesFeed/GameMessagesFeed'
import GmOptionMenu from '../GmOptionMenu/GmOptionMenu'
import styles from './MenuContainer.module.css'
import { useSelector } from 'react-redux'
import { selectChosenMenu } from '../../redux/slices/infoSlice'

const MenuContainer = () => {
    const { t } = useTranslation()

    const chosenMenu = useSelector(selectChosenMenu)

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
                Component: () => <GameMessagesFeed />,
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
