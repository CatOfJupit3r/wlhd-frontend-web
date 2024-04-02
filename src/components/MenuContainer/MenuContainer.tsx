import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectChosenMenu } from '../../redux/slices/gameSlice'

const MenuContainer = () => {
    const chosenMenu = useSelector(selectChosenMenu)

    const menus = useMemo(
        () => [
            {
                key: 'your-entities',
                Component: () => <h1>Menu 1</h1>,
            },
            {
                key: 'action-select',
                Component: () => <h1>Menu 2</h1>,
            },
            {
                key: 'history',
                Component: () => <h1>Menu 3</h1>,
            },
            {
                key: 'gm-settings',
                Component: () => <h1>Menu 4</h1>,
            },
        ],
        []
    )

    return chosenMenu ? (
        <div>
            <h1>{chosenMenu}</h1>
            {menus.find((menu) => menu.key === chosenMenu)?.Component()}
        </div>
    ) : (
        <h1>No menu chosen</h1>
    )
}

export default MenuContainer
