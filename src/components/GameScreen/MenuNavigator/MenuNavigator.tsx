import { ButtonWithTooltip } from '@components/ui/button'
import { useTranslation } from 'react-i18next'
import { FaUsers } from 'react-icons/fa'
import { FaUncharted } from 'react-icons/fa6'
import { MdHistoryToggleOff, MdOutlineVideogameAssetOff } from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'

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
    setChosen,
    tooltipPosition,
}: {
    buttons: typeof LOWER_BUTTONS | typeof UPPER_BUTTONS
    setChosen: (value: string) => void
    tooltipPosition?: 'top' | 'bottom'
}) => {
    const { t } = useTranslation()

    return (
        <>
            {Object.values(buttons).map((pageNavigator, index) => {
                const { Component, key } = pageNavigator
                return (
                    <ButtonWithTooltip
                        key={index}
                        className={
                            'relative m-0 size-16 p-0 transition-colors duration-100 hover:text-[#d9d9d9] active:text-[#b7b7b7]'
                        }
                        onClick={() => {
                            setChosen(key)
                        }}
                        tooltip={key && t(`local:game.action_menus.${key}`)}
                        tooltipProps={{
                            delayDuration: 1500,
                        }}
                        tooltipContentProps={{
                            side: tooltipPosition,
                        }}
                    >
                        <Component className={'size-16'} />
                    </ButtonWithTooltip>
                )
            })}
        </>
    )
}

const MenuNavigator = ({ setChosen }: { setChosen: (value: string) => void }) => {
    return (
        <div className={'flex h-full flex-col items-center justify-between p-3'}>
            <div className={'flex flex-col items-center gap-3'}>
                <ButtonContainerContent buttons={UPPER_BUTTONS} setChosen={setChosen} tooltipPosition={'bottom'} />
            </div>
            <div className={'flex flex-col items-center gap-3'}>
                <ButtonContainerContent buttons={LOWER_BUTTONS} setChosen={setChosen} tooltipPosition={'top'} />
            </div>
        </div>
    )
}

export default MenuNavigator
