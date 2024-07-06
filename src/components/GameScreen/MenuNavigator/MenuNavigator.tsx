import { selectChosenMenu, setChosenMenu } from '@redux/slices/infoSlice'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FaUsers } from 'react-icons/fa'
import { FaUncharted } from 'react-icons/fa6'
import { MdHistoryToggleOff, MdOutlineVideogameAssetOff } from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import styles from './MenuNavigator.module.css'
import { motion } from 'framer-motion'
import { cn } from '@libutils'

const MenuNavigator = () => {
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const chosenMenu = useSelector(selectChosenMenu)

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
                    <div key={index} className={'relative mb-2'}>
                        {(chosenMenu === value || (chosenMenu === null && value === optionNavigators[0].value)) &&
                            chosenMenu !== 'leave-game' && (
                                <motion.div
                                    layoutId="clickedbutton"
                                    transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                                    className={cn(
                                        'absolute inset-0 border-gray-200 border-2 dark:bg-zinc-800 bg-opacity-60 z-10 rounded-2xl'
                                    )}
                                    style={{
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        <Component
                            key={`${componentKeyAlias}-${index}`}
                            title={value && t(`local:game.action_menus.${value}`)}
                            onClick={() => {
                                dispatch(setChosenMenu(value))
                            }}
                            className={'z-20'}
                        />
                    </div>
                )
            })
        },
        [chosenMenu]
    )

    return (
        <div className={styles.navigationContainer}>
            <div id={'option-navigators'} className={styles.navigationButtonContainer}>
                {generateOption(optionNavigators, 'option-navigator')}
            </div>
            <div className={styles.navigationButtonContainer} id={'page-navigators'}>
                {generateOption(pageNavigators, 'page-navigator')}
            </div>
        </div>
    )
}

export default MenuNavigator
