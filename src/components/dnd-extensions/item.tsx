import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import React, { FC, ReactElement, useEffect } from 'react';

export type ItemRenderItemFn = (args: {
    dragOverlay: boolean;
    dragging: boolean;
    sorting: boolean;
    index: number | undefined;
    fadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref?: React.Ref<HTMLElement>;
    style: React.CSSProperties | undefined;
    className?: string;
    transform: iDNDItemProps['transform'];
    transition: iDNDItemProps['transition'];
    value: iDNDItemProps['value'];
}) => ReactElement | null;

export interface iDNDItemProps {
    dragOverlay?: boolean;
    disabled?: boolean;
    dragging?: boolean;
    height?: number;
    index?: number;
    fadeIn?: boolean;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    sorting?: boolean;
    style?: React.CSSProperties;
    className?: string;
    transition?: string | null;
    value: UniqueIdentifier;

    onRemove?(): void;

    ref?: React.Ref<HTMLDivElement>;
    renderItem: ItemRenderItemFn;
}

const PreMemoItem: FC<iDNDItemProps> = ({
    dragOverlay,
    dragging,
    fadeIn,
    index,
    listeners,
    renderItem,
    sorting,
    style,
    transition,
    transform,
    value,
    ref,
    className,
}) => {
    useEffect(() => {
        if (!dragOverlay) {
            return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
            document.body.style.cursor = '';
        };
    }, [dragOverlay]);

    return renderItem
        ? // eslint-disable-next-line react-compiler/react-compiler
          (renderItem({
              dragOverlay: Boolean(dragOverlay),
              dragging: Boolean(dragging),
              sorting: Boolean(sorting),
              index,
              fadeIn: Boolean(fadeIn),
              listeners,
              ref,
              className,
              style,
              transform,
              transition,
              value,
          }) ?? null)
        : null;
};

export const Item = React.memo(PreMemoItem);
