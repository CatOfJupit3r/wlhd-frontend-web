import React, { HTMLProps } from 'react'
import { Skeleton } from '@components/ui/skeleton'
import { Separator } from '@components/ui/separator'

const CharacterDisplayPlaceholder = (props: HTMLProps<HTMLDivElement>) => {
    return (
        <div {...props}>
            <div className="flex flex-row gap-4">
                <Skeleton static={true} className={'size-20'} />
                <div className={'flex flex-col gap-2'}>
                    <Skeleton static={true} className={'h-6 w-32'} />
                    <Skeleton static={true} className={'h-4 w-14'} />
                    <Skeleton static={true} className={'h-5 w-48'} />
                </div>
            </div>
            <Separator />
            <div className={'flex flex-row justify-center gap-2'}>
                <>
                    {Array.from({ length: 6 }, (_, index) => (
                        <Skeleton static={true} className={'h-8 w-9'} key={`skeleton-${index}`} />
                    ))}
                </>
            </div>
            <Separator />
            <div className={'flex h-40 w-full flex-col gap-2'}>
                {Array.from({ length: 5 }, (_, index) => (
                    <Skeleton static={true} className={'h-6 w-full'} key={`skeleton-${index}`} />
                ))}
            </div>
        </div>
    )
}

export default CharacterDisplayPlaceholder
