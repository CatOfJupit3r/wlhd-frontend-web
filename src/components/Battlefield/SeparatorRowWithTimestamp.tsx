import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { SeparatorTile, tileClassName } from '@components/Battlefield/Tiles/CosmeticTiles';
import { BlocksWaveSpinner } from '@components/Spinner';
import { cn } from '@utils';

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const UPDATE_INTERVAL_MS = 1000;

const formatTime = (milliseconds: number) => {
    if (milliseconds === 0) return '00:00';
    if (milliseconds < -FIVE_MINUTES_MS) {
        return '--:--';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(Math.abs(totalSeconds) / 60);
    const seconds = Math.abs(totalSeconds) % 60;
    const isNegative = totalSeconds < 0;

    return `${isNegative ? '-' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const timeToColor = (time: number, percentageLeft: number) => {
    if (time < 0) {
        return 'text-red-700';
    } else if (percentageLeft <= 25) {
        return 'text-red-500 animate-pulse duration-1000';
    } else if (percentageLeft <= 50) {
        return 'text-yellow-500';
    } else {
        return '';
    }
};

interface iSeparatorWithTimestamp {
    timestamp: number;
}

const SeparatorRowWithTimestamp: FC<iSeparatorWithTimestamp> = ({ timestamp }) => {
    const endTimestamp = useMemo(() => timestamp + FIVE_MINUTES_MS, [timestamp]);
    const [timeLeft, setTimeLeft] = useState(endTimestamp - Date.now());
    const percentageLeft = useMemo(() => (timeLeft / FIVE_MINUTES_MS) * 100, [timeLeft]);

    const calculateTimeLeft = useCallback(() => {
        if (timestamp === null) return 0;
        const endTimestamp = timestamp + FIVE_MINUTES_MS;
        return endTimestamp - Date.now();
    }, [timestamp]);

    useEffect(() => {
        if (timestamp === null) return;
        setTimeLeft(calculateTimeLeft());

        const intervalId = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= -FIVE_MINUTES_MS) {
                clearInterval(intervalId);
            }
        }, UPDATE_INTERVAL_MS);
        return () => clearInterval(intervalId);
    }, [timestamp, calculateTimeLeft]);

    return (
        <div className={'flex flex-row'}>
            <div className={cn(tileClassName, 'p-4')}>
                <BlocksWaveSpinner
                    style={{
                        filter: 'invert(1)',
                    }}
                    className={'size-full'}
                />
            </div>
            <SeparatorTile />
            <SeparatorTile />
            <SeparatorTile />
            <SeparatorTile />
            <SeparatorTile />
            <SeparatorTile />
            <div
                className={
                    cn(
                        tileClassName,
                        'flex items-center justify-center font-bold',
                        timeToColor(timeLeft, percentageLeft),
                    ) + ' text-2xl'
                }
            >
                {timestamp === null ? 'No timestamp' : `${formatTime(timeLeft)}`}
            </div>
        </div>
    );
};

export default SeparatorRowWithTimestamp;
