import { SUPPORTED_DLCs, SupportedDLCs } from 'config';
import { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { gameAssetToComboboxIcon } from '@components/GameAsset';
import { Combobox, ComboboxProps } from '@components/ui/combobox';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { LimitedDLCData } from '@models/api-data';

interface iDescriptorComponents<T extends string = string> {
    value: T;
    onChangeValue: (value: T) => void;
}

interface iDLCSelectProps extends iDescriptorComponents<SupportedDLCs> {
    placeholder?: string;
    selectLabel?: string;

    selectTriggerClassName?: string;
    selectContentClassName?: string;
}

const PreMemoDLCSelect: FC<iDLCSelectProps> = ({
    value,
    onChangeValue,
    placeholder,
    selectLabel,
    selectTriggerClassName,
    selectContentClassName,
}) => {
    return (
        <Select
            value={value}
            onValueChange={(value) => {
                onChangeValue(value);
            }}
        >
            <SelectTrigger className={selectTriggerClassName}>
                <SelectValue placeholder={placeholder ?? 'Select DLC...'} />
            </SelectTrigger>
            <SelectContent className={selectContentClassName}>
                <SelectGroup>
                    <SelectLabel>{selectLabel ?? 'DLC'}</SelectLabel>
                    {SUPPORTED_DLCs.map(({ title, descriptor }) => (
                        <SelectItem key={descriptor} value={descriptor}>
                            {title}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};

export const DLCSelect = memo(PreMemoDLCSelect);

interface iGameComponentDescriptorCombobox
    extends iDescriptorComponents,
        Omit<ComboboxProps, 'items' | 'onChange' | 'value'> {
    items: LimitedDLCData;
}

export const GameComponentDescriptorCombobox: FC<iGameComponentDescriptorCombobox> = ({
    items,
    value,
    onChangeValue,
    ...props
}) => {
    const { t } = useTranslation();

    return (
        <Combobox
            items={Object.entries(items ?? {}).map(([descriptor, item]) => ({
                value: descriptor,
                label: t(item.decorations.name),
                icon: gameAssetToComboboxIcon(item),
            }))}
            includeSearch={true}
            value={value}
            onChange={(e) => {
                onChangeValue(e);
            }}
            {...props}
        />
    );
};
