import { useTranslation } from 'react-i18next'
import { FaUsers } from 'react-icons/fa'
import { FaUncharted } from 'react-icons/fa6'
import { MdHistoryToggleOff, MdOutlineVideogameAssetOff } from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import styles from './MenuNavigator.module.css'

const UPPER_BUTTONS = {
    YOUR_ENTITIES: {
        key: 'your-entities',
        Component: FaUsers,
    },
    ACTION_SELECT: {
        key: 'action-select',
        Component: FaUncharted,
    },
    HISTORY: {
        key: 'history',
        Component: MdHistoryToggleOff,
    },
}

const LOWER_BUTTONS = {
    GM_SETTINGS: {
        key: 'gm-settings',
        Component: TbManualGearbox,
    },
    LEAVE_GAME: {
        key: 'leave-game',
        Component: MdOutlineVideogameAssetOff,
    },
}

const ButtonContainerContent = ({
    buttons,
    componentKeyAlias,
    setChosen,
}: {
    buttons: typeof LOWER_BUTTONS | typeof UPPER_BUTTONS
    componentKeyAlias: string
    setChosen: (value: string) => void
}) => {
    const { t } = useTranslation()

    return (
        <>
            {Object.values(buttons).map((pageNavigator, index) => {
                const { Component, key } = pageNavigator
                return (
                    <div key={index} className={'relative mb-2'}>
                        <Component
                            key={`${componentKeyAlias}-${index}`}
                            title={key && t(`local:game.action_menus.${key}`)}
                            onClick={() => {
                                setChosen(key)
                            }}
                        />
                    </div>
                )
            })}
        </>
    )
}

const MenuNavigator = ({ setChosen }: { setChosen: (value: string) => void }) => {
    return (
        <div className={styles.navigationContainer}>
            <div id={'option-navigators'} className={styles.navigationButtonContainer}>
                <ButtonContainerContent
                    buttons={UPPER_BUTTONS}
                    componentKeyAlias={'option-navigator'}
                    setChosen={setChosen}
                />
            </div>
            <div className={styles.navigationButtonContainer} id={'page-navigators'}>
                <ButtonContainerContent
                    buttons={LOWER_BUTTONS}
                    componentKeyAlias={'page-navigator'}
                    setChosen={setChosen}
                />
            </div>
        </div>
    )
}

export default MenuNavigator
