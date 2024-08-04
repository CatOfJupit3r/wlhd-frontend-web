import { cn } from '@lib/utils'
import { HTMLAttributes } from 'react'

function Skeleton({
    className,
    ...props
}: {
    static?: boolean
} & HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(`rounded-md bg-muted ${props.static ? '' : 'animate-pulse'}`, className)} {...props} />
}

const StaticSkeleton = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    return <Skeleton static={true} className={className} {...props} />
}

export { Skeleton, StaticSkeleton }
