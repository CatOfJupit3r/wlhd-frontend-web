import CategoryContent from '@components/GameWiki/CategoryContent';
import { PseudoCategoryContent } from '@components/GameWiki/PseudoCategoryContent';
import { Button } from '@components/ui/button';
import paths from '@router/paths';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAddressCard } from 'react-icons/fa';
import { GiKnapsack, GiSpellBook, GiSwordsEmblem } from 'react-icons/gi';
import { IoMdReturnLeft } from 'react-icons/io';
import { IoLayersSharp } from 'react-icons/io5';
import { useNavigate } from 'react-router';

interface iDLCContents {}

const DLCContents: FC<iDLCContents> = () => {
    const [selected, setSelected] = React.useState<string | null>(null);
    const navigate = useNavigate();
    const { t } = useTranslation('local', {
        keyPrefix: 'wiki.buttons',
    });

    return (
        <div className={'flex h-full w-full flex-row p-4'}>
            <div className={'flex h-full w-1/4 flex-col gap-8 p-4'}>
                <div>
                    <Button
                        onClick={() => {
                            navigate(paths.wiki);
                        }}
                        variant={'default'}
                        className={'flex w-full flex-row gap-2'}
                    >
                        <IoMdReturnLeft className={'size-6'} />
                        {t('back-to-dlc-select')}
                    </Button>
                </div>
                <div className={'flex flex-col gap-3'}>
                    {[
                        {
                            name: 'characters',
                            icon: FaAddressCard,
                            value: 'characters',
                        },
                        {
                            name: 'spells',
                            icon: GiSpellBook,
                            value: 'spells',
                        },
                        {
                            name: 'items',
                            icon: GiKnapsack,
                            value: 'items',
                        },
                        {
                            name: 'weapons',
                            icon: GiSwordsEmblem,
                            value: 'weapons',
                        },
                        {
                            name: 'status-effects',
                            icon: IoLayersSharp,
                            value: 'statusEffects',
                        },
                    ].map(({ name, value, icon }, index) => {
                        return (
                            <Button
                                key={index}
                                onClick={() => {
                                    if (selected === value) {
                                        setSelected(null);
                                    } else {
                                        setSelected(value);
                                    }
                                }}
                                variant={selected === value ? 'default' : 'secondary'}
                                className={'w-full'}
                            >
                                {icon({
                                    className: 'inline-block mr-2 size-6',
                                })}
                                {t(name)}
                            </Button>
                        );
                    })}
                </div>
            </div>
            <div className={'size-full'}>
                {selected ? <CategoryContent category={selected} /> : <PseudoCategoryContent />}
            </div>
        </div>
    );
};

export default DLCContents;
