import { FC, HTMLAttributes } from 'react';

import { cn } from '@utils';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    pulsating?: boolean;
}

export const Skeleton: FC<SkeletonProps> = ({ className, pulsating = true, ...props }) => {
    return <div className={cn(`rounded-md bg-muted ${pulsating ? 'animate-pulse' : ''}`, className)} {...props} />;
};

export const StaticSkeleton: FC<Omit<SkeletonProps, 'pulsating'>> = ({ className, ...props }) => {
    return <Skeleton pulsating={false} className={className} {...props} />;
};

export const PulsatingSkeleton: FC<Omit<SkeletonProps, 'pulsating'>> = ({ className, ...props }) => {
    return <Skeleton pulsating={true} className={className} {...props} />;
};
