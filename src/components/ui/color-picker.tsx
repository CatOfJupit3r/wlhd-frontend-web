'use client';

import { Button, ButtonProps, CopyButton } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { cn } from '@utils';
import { forwardRef, useRef, useState } from 'react';
import { HexColorInput, HexColorModel, Hue, Saturation, useColorManipulation, useStyleSheet } from 'react-colorful';
import { LuCopy } from 'react-icons/lu';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
}

const PRESET_COLORS = [
    // RED
    '#e75560',
    '#E4003A',
    // BLUE
    '#578FCA',
    '#3674B5',
    // GREEN
    '#33FF9E',
    '#56ce5b',
    // PURPLE
    '#C68EFD',
    '#9933FF',
    // YELLOW
    '#FFF085',
    '#F9CB43',
    // BLACK AND WHITE
    '#F6F1DE',
    '#030303',
    // ORANGISH
    '#FD8B51',
    '#CB6040',
];

const ColorPicker = forwardRef<HTMLInputElement, Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps>(
    ({ disabled, value, onChange, onBlur, name, className, ...props }) => {
        const nodeRef = useRef<HTMLDivElement>(null);
        useStyleSheet(nodeRef);
        const [hsva, updateHsva] = useColorManipulation(HexColorModel, value, onChange);

        const [open, setOpen] = useState(false);

        return (
            <Popover onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
                    <Button
                        {...props}
                        className={cn('block', className)}
                        name={name}
                        onClick={() => {
                            setOpen(true);
                        }}
                        size="icon"
                        style={{
                            backgroundColor: value,
                        }}
                        variant="outline"
                    >
                        <div />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="h-[350px] w-[300px]">
                    <div className="flex h-full gap-4">
                        <div className={'h-full flex-1'} ref={nodeRef}>
                            <div className={'react-colorful rounded-xl'}>
                                <Saturation hsva={hsva} onChange={updateHsva} />
                            </div>

                            <div className="mt-4">
                                <Label htmlFor="hue-slider" className="text-sm font-medium">
                                    Hue
                                </Label>
                                <Hue hue={hsva.h} onChange={updateHsva} />
                            </div>

                            <div className="mt-4 flex items-center gap-2">
                                <div className="relative flex-1">
                                    <HexColorInput
                                        color={value}
                                        onChange={onChange}
                                        prefixed
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    <CopyButton
                                        value={value}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                                    >
                                        <LuCopy className="h-4 w-4" />
                                    </CopyButton>
                                </div>
                            </div>
                        </div>

                        <div className="m-0 grid grid-cols-2 content-start gap-y-2">
                            {PRESET_COLORS.map((color, index) => (
                                <Button
                                    key={index}
                                    className="size-6 rounded-sm border border-input p-0"
                                    style={{ backgroundColor: color }}
                                    onClick={() => onChange(color)}
                                    variant="outline"
                                />
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        );
    },
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
