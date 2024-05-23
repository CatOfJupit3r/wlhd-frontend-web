import { useCallback, useMemo } from 'react'
import { FaUsers } from 'react-icons/fa'
import { FaUncharted } from 'react-icons/fa6'
import { MdHistoryToggleOff, MdOutlineVideogameAssetOff } from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import { useDispatch } from 'react-redux'
import { setChosenMenu } from '../../../redux/slices/infoSlice'
import {useTranslation} from "react-i18next";
import styles from './MenuNavigator.module.css'

const MenuNavigator = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const optionNavigators = useMemo(
        () => [
            {
                Component: FaUsers,
                value: 'your-entities',
            },
            {
                Component: FaUncharted,
                value: 'action-select',
            },
            {
                Component: MdHistoryToggleOff,
                value: 'history',
            },
        ],
        []
    )

    const pageNavigators = useMemo(
        () => [
            {
                Component: TbManualGearbox,
                value: 'gm-settings',
            },
            {
                Component: MdOutlineVideogameAssetOff,
                value: 'leave-game',
            },
        ],
        []
    )

    const generateOption = useCallback(
        (arr: typeof optionNavigators | typeof pageNavigators, componentKeyAlias: string) => {
            return arr.map((pageNavigator, index) => {
                const { Component, value } = pageNavigator
                return (
                    <Component
                        key={`${componentKeyAlias}-${index}`}
                        title={value && t(`local:game.action_menus.${value}`)}
                        onClick={() => {
                            dispatch(setChosenMenu(value))
                        }}
                    />
                )
            })
        },
        []
    )

    return (
        <div
            className={styles.navigationContainer}
        >
            <div
                id={'option-navigators'}
                className={styles.navigationButtonContainer}
            >
                {generateOption(optionNavigators, 'option-navigator')}
            </div>
            <div
                className={styles.navigationButtonContainer}
                id={'page-navigators'}
            >
                {generateOption(pageNavigators, 'page-navigator')}
            </div>
        </div>
    )
}

export default MenuNavigator
