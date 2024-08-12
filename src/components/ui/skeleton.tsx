import { HTMLAttributes } from 'react'
import { cn } from '@utils'

function Skeleton({
    className,
    pulsating,
    ...props
}: {
    pulsating?: boolean
} & HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(`rounded-md bg-muted ${pulsating ? 'animate-pulse' : ''}`, className)} {...props} />
}

const StaticSkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return <Skeleton pulsating={false} className={className} {...props} />
}

export { Skeleton, StaticSkeleton }
