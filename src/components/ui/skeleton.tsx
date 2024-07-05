import { cn } from '@lib/utils'
import { HTMLAttributes } from 'react'

function Skeleton({ className, ...props }: {
    static?: boolean
} & HTMLAttributes<HTMLDivElement>) {
    return <div className={cn(`rounded-md bg-muted ${props.static ? '' : 'animate-pulse' }`, className)} {...props} />
}

export { Skeleton }
