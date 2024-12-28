import { cn } from '@utils'
import { HTMLAttributes } from 'react'

function Skeleton({
    className,
    pulsating = true,
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
