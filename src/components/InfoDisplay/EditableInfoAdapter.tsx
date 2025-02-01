import {
    ItemInfoDisplay,
    SpellInfoDisplay,
    StatusEffectInfoDisplay,
    WeaponInfoDisplay,
} from '@components/InfoDisplay/InfoDisplay';
import { ItemEditable, SpellEditable, StatusEffectEditable, WeaponEditable } from '@models/CombatEditorModels';
import GameConverters from '@services/GameConverters';
import { FC } from 'react';

interface iItemEditableAdapter {
    descriptor?: string;
    type: 'item';
    info: ItemEditable;
}

interface iWeaponEditableAdapter {
    descriptor?: string;
    type: 'weapon';
    info: WeaponEditable;
}

interface iSpellEditableAdapter {
    descriptor?: string;
    type: 'spell';
    info: SpellEditable;
}

interface iStatusEffectEditableAdapter {
    descriptor?: string;
    type: 'status_effect';
    info: StatusEffectEditable;
}

type EditableInfoAdapterProps =
    | iItemEditableAdapter
    | iWeaponEditableAdapter
    | iSpellEditableAdapter
    | iStatusEffectEditableAdapter;

export const EditableInfoAdapter: FC<EditableInfoAdapterProps> = ({ type, info, descriptor }) => {
    switch (type) {
        case 'item':
            return <ItemInfoDisplay info={GameConverters.convertItemEditableToInfo(descriptor ?? 'what', info)} />;
        case 'weapon':
            return <WeaponInfoDisplay info={GameConverters.convertWeaponEditableToInfo(descriptor ?? 'what', info)} />;
        case 'spell':
            return <SpellInfoDisplay info={GameConverters.convertSpellEditableToInfo(descriptor ?? 'what', info)} />;
        case 'status_effect':
            return (
                <StatusEffectInfoDisplay
                    info={GameConverters.convertStatusEffectEditableToInfo(descriptor ?? 'what', info)}
                />
            );
        default:
            return null;
    }
};

export const ItemEditableInfoAdapter: FC<Omit<iItemEditableAdapter, 'type'>> = (props) => (
    <EditableInfoAdapter type={'item'} {...props} />
);

export const WeaponEditableInfoAdapter: FC<Omit<iWeaponEditableAdapter, 'type'>> = (props) => (
    <EditableInfoAdapter type={'weapon'} {...props} />
);

export const SpellEditableInfoAdapter: FC<Omit<iSpellEditableAdapter, 'type'>> = (props) => (
    <EditableInfoAdapter type={'spell'} {...props} />
);

export const StatusEffectEditableInfoAdapter: FC<Omit<iStatusEffectEditableAdapter, 'type'>> = (props) => (
    <EditableInfoAdapter type={'status_effect'} {...props} />
);
