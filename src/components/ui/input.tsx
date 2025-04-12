import * as React from 'react';
import { FC, useCallback, useMemo } from 'react';

import { cn } from '@utils';
import { z } from 'zod';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`,
                className,
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = 'Input';

interface NumberInputProps extends Omit<InputProps, 'onChange' | 'type' | 'max' | 'min'> {
    max?: number;
    min?: number;
    onChange: (value: number) => void;
    fallbackValue?: number;
}

const NumberInput: FC<NumberInputProps> = ({ className, max = 99, min = 0, onChange, fallbackValue, ...props }) => {
    const fallbackValueOrMin = useMemo(() => fallbackValue ?? min, [fallbackValue, min]);

    const schema = useMemo(
        () =>
            z
                .number()
                .min(min)
                .max(max)
                .default(fallbackValueOrMin)
                .catch((_) => fallbackValueOrMin),
        [fallbackValueOrMin, max, min],
    );

    const onChangeHandler = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (value === '') {
                onChange(fallbackValueOrMin);
                return;
            }

            try {
                const convertedValue = parseInt(value);
                if (isNaN(convertedValue)) {
                    onChange(fallbackValueOrMin);
                    return;
                }
                const parsedValue = schema.parse(convertedValue);
                onChange(parsedValue);
            } catch {
                // errors from parseInt
                // zod does not throw errors here, as they are caught by `.catch`
                onChange(fallbackValueOrMin);
            }
        },
        [onChange, schema, fallbackValueOrMin],
    );

    return <Input className={className} type={'number'} onChange={onChangeHandler} {...props} />;
};

export { Input, NumberInput };
