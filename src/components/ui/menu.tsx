import { Separator } from '@components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@components/ui/toggle-group'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface MenuItem {
    value: string
    component: React.FC
    icon: React.FC<{ className: string }>
    disabled?: boolean
}

export type MenuSelection = Array<MenuItem>

export const EmptyMenuContent = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.character-display',
    })

    return (
        <div className={'flex flex-col items-center p-4'}>
            <p className={'text-t-normal font-medium'}>{t('nothing_here')}</p>
            <p className={'text-t-small italic text-gray-700'}>{t('try_another')}</p>
        </div>
    )
}
const Menu = ({ selection }: { selection: MenuSelection }) => {
    const [currentMenu, setCurrentMenu] = useState<string>('')
    const [menusToSelect, setMenusToSelect] = useState<MenuSelection>(selection)

    useEffect(() => {
        setMenusToSelect(selection)
    }, [selection])

    const CurrentComponent = useMemo(() => {
        return menusToSelect.find((container) => container.value === currentMenu)?.component || EmptyMenuContent
    }, [currentMenu])

    return (
        <div className={'flex flex-col gap-2'}>
            <ToggleGroup
                type={'single'}
                onValueChange={(value) => {
                    setCurrentMenu(value)
                }}
            >
                {menusToSelect
                    .map(({ value, icon, disabled }) => (
                        <ToggleGroupItem key={value} value={value} disabled={disabled ?? false}>
                            {icon({ className: 'size-8' })}
                        </ToggleGroupItem>
                    ))
                    .sort((a, b) => {
                        if (a.props.disabled) {
                            return 1
                        } else if (b.props.disabled) {
                            return -1
                        } else {
                            return a.props.value > b.props.value ? 1 : -1
                        }
                    })}
            </ToggleGroup>
            <Separator />
            <CurrentComponent />
        </div>
    )
}

export default Menu
