import { Children, FC, HTMLAttributes, ReactNode } from 'react';

import { Separator } from '@components/ui/separator';

interface iSeparatedDiv extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

/**
 * Add <Separator /> after each child element
 */
const SeparatedDiv: FC<iSeparatedDiv> = ({ children, ...props }) => {
    return (
        <div {...props}>
            {Children.toArray(children)
                .filter((child) => child)
                .map((child, index, arr) => (
                    <>
                        {child}
                        {index !== arr.length - 1 ? <Separator /> : null}
                    </>
                ))}
        </div>
    );
};

export default SeparatedDiv;
