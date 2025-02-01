import { cn } from '@utils';

const PERCENTAGE_TO_COLORS = (percentage: number): string => {
    if (percentage <= 95) {
        return 'text-gray-400';
    }
    if (percentage < 100) {
        return 'text-yellow-400';
    }
    return 'text-red-500';
};

const CharacterLimit = ({
    characterLimit,
    text,
    className,
    textSizeClass = 'text-sm',
}: {
    characterLimit: number;
    text: string;
    className?: string;
    textSizeClass?: string;
}) => {
    return (
        <p
            // turns out that `cn` is a function does not support custom text sizes. Damn it.
            className={`${cn('transition-colors', PERCENTAGE_TO_COLORS((text.length / (characterLimit || 1)) * 100), className)} ${textSizeClass}`}
        >
            {text.length}/{characterLimit}
        </p>
    );
};

export default CharacterLimit;
