import { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Decoration.module.css';

import { useBattlefieldContext } from '@context/BattlefieldContext';
import { cn } from '@utils';

const Decoration = ({ square }: { square: string }) => {
    const { battlefield } = useBattlefieldContext();

    const { interactable, clicked, active } = useMemo(() => battlefield[square].flags, [battlefield, square]);
    const [interactivityType, setInteractivityType] = useState('');

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
        </>
    );
};

export default Decoration;
