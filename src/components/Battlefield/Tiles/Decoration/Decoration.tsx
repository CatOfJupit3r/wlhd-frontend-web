import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Decoration.module.css';

import { useBattlefieldContext } from '@context/BattlefieldContext';
import { cn } from '@utils';

const Decoration = ({ square }: { square: string }) => {
    const { battlefield } = useBattlefieldContext();

    const { interactable, clicked, active, aoe_highlight } = useMemo(
        () => battlefield[square].flags,
        [battlefield, square],
    );
    const [interactivityType, setInteractivityType] = useState('');
    const hasLeftBorder = useMemo(() => aoe_highlight.includes('LEFT'), [aoe_highlight]);
    const hasRightBorder = useMemo(() => aoe_highlight.includes('RIGHT'), [aoe_highlight]);
    const hasTopBorder = useMemo(() => aoe_highlight.includes('TOP'), [aoe_highlight]);
    const hasBottomBorder = useMemo(() => aoe_highlight.includes('BOTTOM'), [aoe_highlight]);

    useEffect(() => {
        if (interactable.flag) {
            setInteractivityType(() => {
                switch (interactable.type) {
                    case 'ally':
                        return `${styles.borderInCorner} ${styles.interactableAlly}`;
                    case 'enemy':
                        return `${styles.borderInCorner} ${styles.interactableEnemy}`;
                    default:
                        return '';
                }
            });
        } else {
            if (interactivityType !== '') {
                setInteractivityType('');
            }
        }
    }, [interactable]);

    const getClickedNumberIcon = useCallback(() => {
        if (clicked <= 9 && clicked >= 0) {
            return '/assets/local/sel_sqr_' + clicked.toString() + '.svg';
        } else if (clicked > 9) {
            return '/assets/local/sel_sqr_9extnd.svg';
        }
        return null;
    }, [clicked]);

    return (
        // this might effect the performance because components are still in the DOM
        // will see
        <>
            <img
                className={cn(
                    styles.activeCharacter,
                    'transition-opacity',
                    active ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                src="/assets/local/active_character.svg"
                alt="Decoration"
            />
            <div
                className={cn(
                    styles.decoration,
                    styles.clickedCharacterBorder,
                    'transition-opacity',
                    clicked ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
            />
            <img
                className={cn(
                    styles.clickedSquare,
                    'transition-opacity',
                    clicked > 1 ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                src={getClickedNumberIcon() || '/assets/local/sel_sqr_1.svg'}
                alt={`Clicked ${clicked} times icon`}
            />
            <div className={cn(styles.decoration, interactivityType)} />
            {/** width */}
            <div
                className={cn(
                    'duration-50 absolute inset-0 z-10 rounded-xl border-[#D471ED] transition-all',
                    // we do this trickery so that tailwindcss properly generates the borders
                    hasLeftBorder ? 'border-l-8' : '',
                    hasRightBorder ? 'border-r-8' : '',
                    hasTopBorder ? 'border-t-8' : '',
                    hasBottomBorder ? 'border-b-8' : '',

                    hasLeftBorder && !hasBottomBorder ? 'rounded-bl-none' : '',
                    hasRightBorder && !hasBottomBorder ? 'rounded-br-none' : '',

                    hasTopBorder && !hasLeftBorder ? 'rounded-tl-none' : '',
                    hasTopBorder && !hasRightBorder ? 'rounded-tr-none' : '',

                    hasLeftBorder && !hasTopBorder ? 'rounded-tl-none' : '',
                    hasRightBorder && !hasTopBorder ? 'rounded-tr-none' : '',

                    hasBottomBorder && !hasLeftBorder ? 'rounded-bl-none' : '',
                    hasBottomBorder && !hasRightBorder ? 'rounded-br-none' : '',

                    aoe_highlight.length > 0 ? '' : 'pointer-events-none opacity-0',
                )}
                style={{
                    width: 'var(--tile-size)',
                    height: 'var(--tile-size)',
                }}
            />
        </>
    );
};

export default Decoration;
