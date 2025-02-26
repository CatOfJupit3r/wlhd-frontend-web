import { IconComponentType } from '@components/icons/icon_factory';
import { Button } from '@components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@utils';
import { ClassValue } from 'clsx';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconType } from 'react-icons';
import { PiDotsThreeOutline } from 'react-icons/pi';

const PlaceholderIcon = PiDotsThreeOutline;

interface Item {
    value: string;
    label: string;
    icon?: IconComponentType;
    disabled?: boolean;
}

export type ComboboxItemArray = Array<Item>;

export interface ComboboxProps {
    items: ComboboxItemArray;
    value: string;
    onChange: (value: string) => void;
    selectText?: string;
    includeSearch?: boolean;
    size?: {
        width?: ClassValue;
        height?: ClassValue;
    };
}

const iconSizeClassName = 'size-10';

const ComboBoxItem = ({ icon, label }: { icon?: IconComponentType | IconType; label: string }) => {
    const [badIcon, setBadIcon] = useState(false);

    return (
        <div className="flex max-w-[90%] items-center">
            {icon ? (
                badIcon ? (
                    <PlaceholderIcon className={cn(iconSizeClassName, 'opacity-10')} />
                ) : (
                    icon({
                        onError: () => {
                            setBadIcon(true);
                        },
                        className: iconSizeClassName,
                    })
                )
            ) : null}
            <p className={cn('truncate', icon ? 'ml-2' : '')}>{label}</p>
        </div>
    );
};

export const Combobox = ({ items, value, onChange, selectText, size, includeSearch }: ComboboxProps) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('local', {
        keyPrefix: 'ui',
    });

    const [buttonWidth, setButtonWidth] = useState<string | number>('auto');

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn('justify-between text-left', size?.width || 'w-full', size?.height || 'h-[50px]')}
                    ref={buttonRef}
                >
                    <div className={'w-[90%]'}>
                        {items.find((item) => item.value === value) ? (
                            <ComboBoxItem
                                icon={items.find((item) => item.value === value)!.icon || undefined}
                                label={items.find((item) => item.value === value)!.label}
                            />
                        ) : (
                            <ComboBoxItem icon={PlaceholderIcon} label={selectText || t('select')} />
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    'p-1',
                    size?.width || 'max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width]',
                )}
                ref={contentRef}
                style={{
                    width: buttonWidth,
                }}
            >
                <Command>
                    {includeSearch && <CommandInput placeholder={selectText || t('select')} />}
                    <CommandEmpty>{t('empty')}</CommandEmpty>
                    <CommandGroup>
                        <CommandList>
                            {items &&
                                items.map((item) => (
                                    <CommandItem
                                        disabled={item.disabled}
                                        key={item.value}
                                        value={item.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue === value ? '' : currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mx-2 size-4',
                                                value === item.value ? 'opacity-100' : 'opacity-0',
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
    );
};
