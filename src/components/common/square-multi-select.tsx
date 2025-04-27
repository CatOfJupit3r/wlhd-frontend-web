import { FC } from 'react';

import { MultiSelect, MultiSelectProps } from '@components/ui/multi-select';

interface iSquareMultiSelect extends Omit<MultiSelectProps, 'options' | 'onValueChange' | 'onChange'> {
    values: Array<string>;
    onChange: (value: Array<string>) => void;
    placeholder?: string;
}

const ALL_SQUARES = [1, 2, 3, 4, 5, 6].map((line) => [1, 2, 3, 4, 5, 6].map((column) => `${line}/${column}`)).flat();

export const SquareMultiSelect: FC<iSquareMultiSelect> = ({ onChange, values, ...props }) => (
    <MultiSelect
        options={ALL_SQUARES.map((option) => ({ label: option, value: option }))}
        onValueChange={(newValues) => {
            onChange(newValues);
        }}
        defaultValue={values}
        placeholder={'Select squares'}
        {...props}
    />
);
