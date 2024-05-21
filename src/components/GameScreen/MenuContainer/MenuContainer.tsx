import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ActionInput from '../ActionInput/ActionInput'
import ControlledEntitiesInfo from '../ControlledEntitiesInfo/ControlledEntitiesInfo'
import GmOptionMenu from '../GmOptionMenu/GmOptionMenu'
import styles from './MenuContainer.module.css'
import { useSelector } from 'react-redux'
import { selectChosenMenu } from '../../../redux/slices/infoSlice'
import GameMessagesFeed from '../GameMessages/GameMessagesFeed'

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

    const displayMenu = useCallback(() => {
        if (!chosenMenu) {
            if (menus.length === 0) {
                return <>
                    <h1 className={styles.menuHeader}>{t('local:game.action_menus.no_menu_available')}</h1>
                    <div>
                        {t('local:game.action_menus.report_this_issue')}
                    </div>
                </>
            }
            return (
                <>
                    <h1 className={styles.menuHeader}>{t(`local:game.action_menus.${menus[0].key}`)}</h1>
                    {menus[0].Component()}
                </>
            )
        }
        return (
            <>
                <h1 className={styles.menuHeader}>{t(`local:game.action_menus.${chosenMenu}`)}</h1>
                {menus.find((menu) => menu.key === chosenMenu)?.Component()}
            </>
        )
    }, [chosenMenu, menus, t])

    return <div className={styles.menuContainer}>{displayMenu()}</div>
}

export default MenuContainer
