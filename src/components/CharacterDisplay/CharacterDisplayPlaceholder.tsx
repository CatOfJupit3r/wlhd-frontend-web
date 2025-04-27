import { HTMLProps } from 'react';

import { Separator } from '@components/ui/separator';
import { StaticSkeleton } from '@components/ui/skeleton';

const CharacterDisplayPlaceholder = (props: HTMLProps<HTMLDivElement>) => {
    return (
        <div {...props}>
            <div className="flex flex-row gap-4">
                <StaticSkeleton className={'size-20'} />
                <div className={'flex flex-col gap-2'}>
                    <StaticSkeleton className={'h-6 w-32'} />
                    <StaticSkeleton className={'h-4 w-14'} />
                    <StaticSkeleton className={'h-5 w-48'} />
                </div>
            </div>
            <Separator />
            <div className={'flex flex-row justify-center gap-2'}>
                <>
                    {Array.from({ length: 6 }, (_, index) => (
                        <StaticSkeleton className={'h-8 w-9'} key={`skeleton-${index}`} />
                    ))}
                </>
            </div>
            <Separator />
            <div className={'flex h-40 w-full flex-col gap-2'}>
                {Array.from({ length: 5 }, (_, index) => (
                    <StaticSkeleton className={'h-6 w-full'} key={`skeleton-${index}`} />
                ))}
            </div>
        </div>
    );
};

export default CharacterDisplayPlaceholder;
