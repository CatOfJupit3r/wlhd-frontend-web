import {
    AreaEffectEditableInfoAdapter,
    ItemEditableInfoAdapter,
    SpellEditableInfoAdapter,
    StatusEffectEditableInfoAdapter,
    WeaponEditableInfoAdapter,
} from '@components/InfoDisplay/EditableInfoAdapter';
import {
    AreaEffectInfoDisplayPlaceholder,
    ItemInfoDisplayPlaceholder,
    SpellInfoDisplayPlaceholder,
    StatusEffectInfoDisplayPlaceholder,
    WeaponInfoDisplayPlaceholder,
} from '@components/InfoDisplay/InfoDisplayPlaceholder';
import {
    useGameAreaEffectInformation,
    useGameItemInformation,
    useGameSpellInformation,
    useGameStatusEffectInformation,
    useGameWeaponInformation,
} from '@queries/useGameData';
import { FC } from 'react';

interface iInfoDisplayWithDescriptor {
    dlc: string;
    descriptor: string;
}

const ItemInfoDisplayWithDescriptor: FC<iInfoDisplayWithDescriptor> = ({ dlc, descriptor }) => {
    const { item, isPending } = useGameItemInformation(dlc, descriptor);

    if (isPending || !item) {
        return <ItemInfoDisplayPlaceholder />;
    }
    return <ItemEditableInfoAdapter info={item} />;
};

const WeaponInfoDisplayWithDescriptor: FC<iInfoDisplayWithDescriptor> = ({ dlc, descriptor }) => {
    const { weapon, isPending } = useGameWeaponInformation(dlc, descriptor);

    if (isPending || !weapon) {
        return <WeaponInfoDisplayPlaceholder />;
    }
    return <WeaponEditableInfoAdapter info={weapon} />;
};

const SpellInfoDisplayWithDescriptor: FC<iInfoDisplayWithDescriptor> = ({ dlc, descriptor }) => {
    const { spell, isPending } = useGameSpellInformation(dlc, descriptor);

    if (isPending || !spell) {
        return <SpellInfoDisplayPlaceholder />;
    }
    return <SpellEditableInfoAdapter info={spell} />;
};

const StatusEffectInfoDisplayWithDescriptor: FC<iInfoDisplayWithDescriptor> = ({ dlc, descriptor }) => {
    const { statusEffect, isPending } = useGameStatusEffectInformation(dlc, descriptor);

    if (isPending || !statusEffect) {
        return <StatusEffectInfoDisplayPlaceholder />;
    }
    return <StatusEffectEditableInfoAdapter info={statusEffect} />;
};

const AreaEffectInfoDisplayWithDescriptor: FC<iInfoDisplayWithDescriptor> = ({ dlc, descriptor }) => {
    const { areaEffect, isPending } = useGameAreaEffectInformation(dlc, descriptor);

    if (isPending || !areaEffect) {
        return <AreaEffectInfoDisplayPlaceholder />;
    }
    return <AreaEffectEditableInfoAdapter info={areaEffect} />;
};

export {
    ItemInfoDisplayWithDescriptor,
    WeaponInfoDisplayWithDescriptor,
    SpellInfoDisplayWithDescriptor,
    StatusEffectInfoDisplayWithDescriptor,
    AreaEffectInfoDisplayWithDescriptor,
};
