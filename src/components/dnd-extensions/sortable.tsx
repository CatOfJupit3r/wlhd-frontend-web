import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';

import {
    Active,
    Announcements,
    closestCenter,
    CollisionDetection,
    defaultDropAnimationSideEffects,
    DndContext,
    DragOverlay,
    DropAnimation,
    KeyboardCoordinateGetter,
    KeyboardSensor,
    MeasuringConfiguration,
    Modifiers,
    MouseSensor,
    PointerActivationConstraint,
    ScreenReaderInstructions,
    TouchSensor,
    UniqueIdentifier,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    AnimateLayoutChanges,
    arrayMove,
    NewIndexGetter,
    rectSortingStrategy,
    SortableContext,
    sortableKeyboardCoordinates,
    SortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { Item, ItemRenderItemFn } from './item';

export interface Props {
    activationConstraint?: PointerActivationConstraint;
    animateLayoutChanges?: AnimateLayoutChanges;
    Container: FC<{ children?: ReactNode }>; // To-do: Fix me
    adjustScale?: boolean;
    collisionDetection?: CollisionDetection;
    coordinateGetter?: KeyboardCoordinateGetter;
    dropAnimation?: DropAnimation | null;
    getNewIndex?: NewIndexGetter;
    items: UniqueIdentifier[];
    changeItems: (items: UniqueIdentifier[]) => void;
    measuring?: MeasuringConfiguration;
    modifiers?: Modifiers;
    removable?: boolean;
    reorderItems?: typeof arrayMove;
    strategy?: SortingStrategy;
    style?: React.CSSProperties;
    useDragOverlay?: boolean;
    renderItem: ItemRenderItemFn;

    getItemStyles?(args: {
        id: UniqueIdentifier;
        index: number;
        isSorting: boolean;
        isDragOverlay: boolean;
        overIndex: number;
        isDragging: boolean;
    }): React.CSSProperties;

    wrapperStyle?(args: {
        active: Pick<Active, 'id'> | null;
        index: number;
        isDragging: boolean;
        id: UniqueIdentifier;
    }): React.CSSProperties;

    isDisabled?(id: UniqueIdentifier): boolean;
}

const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0',
            },
        },
    }),
    duration: 400, // for some strange reason, there is flicker without this duration
    easing: 'ease-in-out',
};

export function Sortable({
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    Container,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = dropAnimationConfig,
    getItemStyles = () => ({}),
    getNewIndex,
    items,
    isDisabled = () => false,
    measuring,
    modifiers,
    removable,
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    useDragOverlay = true,
    wrapperStyle = () => ({}),
    changeItems,
}: Props) {
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint,
        }),
        useSensor(TouchSensor, {
            activationConstraint,
        }),
        useSensor(KeyboardSensor, {
            // Disable smooth scrolling in Cypress automated tests
            scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
            coordinateGetter,
        }),
    );
    const isFirstAnnouncement = useRef(true);
    const getIndex = (id: UniqueIdentifier) => items.indexOf(id);
    const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
    const activeIndex = activeId != null ? getIndex(activeId) : -1;
    const handleRemove = removable
        ? (id: UniqueIdentifier) => changeItems(items.filter((item) => item !== id))
        : undefined;

    const announcements: Announcements = {
        onDragStart({ active: { id } }) {
            return `Picked up sortable item ${String(id)}. Sortable item ${id} is in position ${getPosition(id)} of ${
                items.length
            }`;
        },
        onDragOver({ active, over }) {
            // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
            // The first `onDragOver` event therefore doesn't need to be announced, because it is called
            // immediately after the `onDragStart` announcement and is redundant.
            if (isFirstAnnouncement.current) {
                isFirstAnnouncement.current = false;
                return;
            }

            if (over) {
                return `Sortable item ${active.id} was moved into position ${getPosition(over.id)} of ${items.length}`;
            }

            return;
        },
        onDragEnd({ active, over }) {
            if (over) {
                return `Sortable item ${active.id} was dropped at position ${getPosition(over.id)} of ${items.length}`;
            }

            return;
        },
        onDragCancel({ active: { id } }) {
            return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
                id,
            )} of ${items.length}.`;
        },
    };

    useEffect(() => {
        if (activeId == null) {
            isFirstAnnouncement.current = true;
        }
    }, [activeId]);

    return (
        <DndContext
            accessibility={{
                announcements,
                screenReaderInstructions,
            }}
            sensors={sensors}
            collisionDetection={collisionDetection}
            onDragStart={({ active }) => {
                if (!active) {
                    return;
                }
                setActiveId(active.id);
            }}
            onDragEnd={({ over }) => {
                setActiveId(null);

                if (over) {
                    const overIndex = getIndex(over.id);
                    if (activeIndex !== overIndex) {
                        changeItems(reorderItems(items, activeIndex, overIndex));
                    }
                }
            }}
            onDragCancel={() => setActiveId(null)}
            measuring={measuring}
            modifiers={modifiers}
        >
            <SortableContext items={items} strategy={strategy}>
                <Container>
                    {items.map((value, index) => {
                        return (
                            <SortableItem
                                key={value}
                                id={value}
                                index={index}
                                style={getItemStyles}
                                disabled={isDisabled(value)}
                                renderItem={renderItem}
                                onRemove={handleRemove}
                                animateLayoutChanges={animateLayoutChanges}
                                useDragOverlay={useDragOverlay}
                                getNewIndex={getNewIndex}
                            />
                        );
                    })}
                </Container>
            </SortableContext>
            {useDragOverlay
                ? createPortal(
                      <DragOverlay adjustScale={adjustScale} dropAnimation={dropAnimation}>
                          {activeId != null ? (
                              <Item
                                  value={items[activeIndex]}
                                  renderItem={renderItem}
                                  style={getItemStyles({
                                      id: items[activeIndex],
                                      index: activeIndex,
                                      isSorting: true,
                                      isDragging: true,
                                      overIndex: -1,
                                      isDragOverlay: true,
                                  })}
                                  dragOverlay
                              />
                          ) : null}
                      </DragOverlay>,
                      document.body,
                  )
                : null}
        </DndContext>
    );
}

interface SortableItemProps {
    animateLayoutChanges?: AnimateLayoutChanges;
    disabled?: boolean;
    getNewIndex?: NewIndexGetter;
    id: UniqueIdentifier;
    index: number;
    useDragOverlay?: boolean;

    onRemove?(id: UniqueIdentifier): void;

    style(values: {
        index: number;
        id: UniqueIdentifier;
        isDragging: boolean;
        isSorting: boolean;
    }): React.CSSProperties;

    renderItem: ItemRenderItemFn;
}

export function SortableItem({
    disabled,
    animateLayoutChanges,
    getNewIndex,
    id,
    index,
    onRemove,
    style,
    renderItem,
    useDragOverlay,
}: SortableItemProps) {
    const { attributes, isDragging, isSorting, listeners, setNodeRef, transform, transition } = useSortable({
        id,
        animateLayoutChanges,
        disabled,
        getNewIndex,
    });

    return (
        <Item
            ref={setNodeRef}
            value={id}
            disabled={disabled}
            dragging={isDragging}
            sorting={isSorting}
            renderItem={renderItem}
            index={index}
            style={style({
                index,
                id,
                isDragging,
                isSorting,
            })}
            onRemove={onRemove ? () => onRemove(id) : undefined}
            transform={transform}
            transition={transition}
            listeners={listeners}
            data-index={index}
            data-id={id}
            dragOverlay={!useDragOverlay && isDragging}
            {...attributes}
        />
    );
}
