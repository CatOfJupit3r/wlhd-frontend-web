import SeparatedDiv from '@components/ui/separated-div';
import { StaticSkeleton } from '@components/ui/skeleton';
import { cn } from '@utils';
import { FC, HTMLAttributes } from 'react';

interface iInfoDisplayPlaceholder extends HTMLAttributes<HTMLDivElement> {
    type: 'item' | 'weapon' | 'spell' | 'status_effect';
}

const InfoDisplayPlaceholder: FC<iInfoDisplayPlaceholder> = ({ type, className, ...props }) => {
    return (
        <SeparatedDiv
            className={cn(
                'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3',
                className,
            )}
            {...props}
        >
            <div id={'main-info'} className={'flex w-full flex-row justify-between overflow-hidden text-xl font-bold'}>
                <div className={'flex w-full flex-row items-center gap-2'}>
                    <StaticSkeleton className={'h-10 w-full max-w-64'} />
                    {type === 'weapon' || type === 'spell' ? <StaticSkeleton className={'size-10'} /> : null}
                </div>
            </div>
            <div id={'minor-info'} className={'relative flex flex-row justify-between text-base'}>
                <div className={'flex flex-col gap-2'}>
                    {(type === 'item' || type === 'weapon') && (
                        <div className={'flex flex-row items-center gap-1'}>
                            <StaticSkeleton className={'size-6'} />
                            <StaticSkeleton className={'h-6 w-16'} />
                        </div>
                    )}
                    {type !== 'status_effect' && (
                        <>
                            <div className={'flex flex-row items-center gap-1'}>
                                <StaticSkeleton className={'size-6'} />
                                <StaticSkeleton className={'h-6 w-16'} />
                            </div>
                            <div className={'flex flex-row items-center gap-1'}>
                                <StaticSkeleton className={'size-6'} />
                                <StaticSkeleton className={'h-6 w-16'} />
                            </div>
                        </>
                    )}
                </div>
                <div id={'type-details'} className={'flex flex-col items-end gap-2'}>
                    {type === 'status_effect' ? (
                        <div className={'flex items-center gap-1'}>
                            <StaticSkeleton className={'size-6'} />
                            <StaticSkeleton className={'h-6 w-8'} />
                        </div>
                    ) : (
                        <>
                            <div className={'flex flex-row items-center gap-1'}>
                                <StaticSkeleton className={'size-6'} />
                                <StaticSkeleton className={'h-6 w-16'} />
                            </div>
                            <div className={'flex flex-row items-center gap-1 text-base'}>
                                <StaticSkeleton className={'size-6'} />
                                <StaticSkeleton className={'h-6 w-16'} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div id={'description'} className={'flex flex-col gap-1 break-words text-sm italic text-gray-400'}>
                <StaticSkeleton className={'h-6 w-full max-w-full'} />
                <StaticSkeleton className={'h-6 w-full max-w-full'} />
                <StaticSkeleton className={'h-6 w-full max-w-[75%]'} />
            </div>
            <div className={'flex flex-row gap-2'}>
                <StaticSkeleton className={'size-6'} />
                <StaticSkeleton className={'h-6 w-16'} />
                <StaticSkeleton className={'w-18 h-6'} />
                <StaticSkeleton className={'h-6 w-32'} />
                <StaticSkeleton className={'h-6 w-12'} />
            </div>
            <div className={'flex w-full flex-col items-center justify-center gap-2'}>
                <StaticSkeleton className={'h-6 w-full max-w-[25%]'} />
                <StaticSkeleton className={'h-6 w-full max-w-[25%]'} />
            </div>
        </SeparatedDiv>
    );
};

export const WeaponInfoDisplayPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplayPlaceholder type={'weapon'} {...props} />
);

export const ItemInfoDisplayPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplayPlaceholder type={'item'} {...props} />
);

export const SpellInfoDisplayPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplayPlaceholder type={'spell'} {...props} />
);

export const StatusEffectInfoDisplayPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplayPlaceholder type={'status_effect'} {...props} />
);

export const AreaEffectInfoDisplayPlaceholder = (props: HTMLAttributes<HTMLDivElement>) => (
    <InfoDisplayPlaceholder type={'status_effect'} {...props} />
);
