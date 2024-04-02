import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectChosenMenu } from '../../redux/slices/gameSlice'
import ActionInput from '../ActionInput/ActionInput'
import ControlledEntitiesInfo from '../ControlledEntitiesInfo/ControlledEntitiesInfo'
import GameStateFeed from '../GameStateFeed/GameStateFeed'
import GmOptionMenu from '../GmOptionMenu/GmOptionMenu'

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
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                height: '100%',
            }}
        >
            <h1>{t(chosenMenu)}</h1>
            {menus.find((menu) => menu.key === chosenMenu)?.Component()}
        </div>
    ) : (
        <h1>No menu chosen</h1>
    )
}

export default MenuContainer
