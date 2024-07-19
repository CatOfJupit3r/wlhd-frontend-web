import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import React, { useState } from 'react'
import { IconComponentType } from '@components/icons/icon_factory'
import { cn } from '@lib/utils'
import { ClassValue } from 'clsx'
import { PlaceholderIcon } from '@components/icons'

interface Item {
    value: string
    label: string
    icon: IconComponentType
    disabled?: boolean
}

interface ComboboxProps {
    items: Item[]
    value: string
    onChange: (value: string) => void
    selectText?: string
    size?: {
        width?: ClassValue
        height?: ClassValue
    }
}

const iconSizeClassName = 'size-10'

const ComboBoxItem = ({ icon, label }: { icon: IconComponentType; label: string }) => {
    const [badIcon, setBadIcon] = useState(false)

    return (
        <div className="flex max-w-[90%] items-center">
            {badIcon ? (
                <PlaceholderIcon className={cn(iconSizeClassName, 'opacity-10')} />
            ) : (
                icon({
                    onError: () => {
                        setBadIcon(true)
                    },
                    className: iconSizeClassName,
                })
            )}
            <p className="ml-2 truncate">{label}</p>
        </div>
    )
}

export const Combobox = ({ items, value, onChange, selectText, size }: ComboboxProps) => {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('justify-between text-left', size?.width || 'w-[400px]', size?.height || 'h-[50px]')}
                >
                    <div className={'w-full'}>
                        <p className={'max-w-[90%] truncate'}>
                            {value && items
                                ? items.find((item) => item.value === value)?.label
                                : selectText || 'Select...'}
                        </p>
                    </div>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn('p-1', size?.width || 'w-[400px]')}>
                <Command>
                    <CommandInput placeholder={selectText || 'Select...'} />
                    <CommandEmpty>Nothing here... huh?..</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {items &&
                                items.map((item) => (
                                    <CommandItem
                                        disabled={item.disabled}
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? '' : currentValue)
                                            setOpen(false)
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mx-2 size-4',
                                                value === item.value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        <ComboBoxItem icon={item.icon} label={item.label} />
                                    </CommandItem>
                                ))}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
