import { useNavigate } from '@tanstack/react-router';
import { SupportedDLCs } from 'config';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAddressCard } from 'react-icons/fa';
import { IoMdReturnLeft } from 'react-icons/io';

import CategoryContent from '@components/GameWiki/CategoryContent';
import { PseudoCategoryContent } from '@components/GameWiki/PseudoCategoryContent';
import { AOEIcon, InventoryIcon, SpellBookIcon, StatusEffectsIcon, WeaponryIcon } from '@components/icons';
import { Button } from '@components/ui/button';
import { Route as WikiDlcSelectRoute } from '@router/_auth_only/game-wiki';

interface iDLCContents {
    dlc: SupportedDLCs;
}

const DLCContents: FC<iDLCContents> = ({ dlc }) => {
    const [selected, setSelected] = React.useState<
        'characters' | 'spells' | 'items' | 'weapons' | 'statusEffects' | 'areaEffects' | null
    >(null);
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
                            navigate({
                                to: WikiDlcSelectRoute.to,
                            });
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
                            icon: SpellBookIcon,
                            value: 'spells',
                        },
                        {
                            name: 'items',
                            icon: InventoryIcon,
                            value: 'items',
                        },
                        {
                            name: 'weapons',
                            icon: WeaponryIcon,
                            value: 'weapons',
                        },
                        {
                            name: 'status-effects',
                            icon: StatusEffectsIcon,
                            value: 'statusEffects',
                        },
                        {
                            name: 'area-effects',
                            icon: AOEIcon,
                            value: 'areaEffects',
                        },
                    ].map(({ name, value, icon }, index) => {
                        return (
                            <Button
                                key={index}
                                onClick={() => {
                                    if (selected === value) {
                                        setSelected(null);
                                    } else {
                                        setSelected(value as typeof selected);
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
                {selected ? <CategoryContent category={selected} dlc={dlc} /> : <PseudoCategoryContent />}
            </div>
        </div>
    );
};

export default DLCContents;
