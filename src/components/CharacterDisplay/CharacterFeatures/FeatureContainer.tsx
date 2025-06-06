import { CharacterInfoFull } from '@type-defs/game-types';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import AttributeDisplay from '@components/CharacterDisplay/CharacterFeatures/AttributeDisplay';
import ComponentMemoriesDisplay from '@components/InfoDisplay/ComponentMemoriesDisplay';
import {
    ItemInfoDisplay,
    SpellInfoDisplay,
    StatusEffectInfoDisplay,
    WeaponInfoDisplay,
} from '@components/InfoDisplay/InfoDisplay';
import TagsDisplay from '@components/InfoDisplay/TagsDisplay';
import { EmptyMenuContent } from '@components/ui/menu';
import { Separator } from '@components/ui/separator';

const SupportedFeatures = ['inventory', 'statusEffects', 'spells', 'weaponry', 'attributes', 'misc'] as const;

type FeatureProps = {
    type: (typeof SupportedFeatures)[number] | string;
    info: CharacterInfoFull;
    flags: {
        ignoreAttributes?: Array<string>;
    };
};

const FeatureContainerContent: FC<FeatureProps> = ({ type, info, flags }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.character-display',
    });
    if (!type || !(SupportedFeatures.indexOf(type as never) > -1)) {
        return <EmptyMenuContent />;
    }

    switch (type) {
        case 'inventory': {
            const { inventory } = info;
            if (inventory && inventory.length > 0) {
                return (
                    <>
                        {inventory.map((item, index) => {
                            return <ItemInfoDisplay key={index} info={item} />;
                        })}
                    </>
                );
            }
            break;
        }
        case 'statusEffects': {
            const { statusEffects } = info;
            if (statusEffects && statusEffects.length > 0) {
                return (
                    <>
                        {statusEffects.map((effect, index) => {
                            return <StatusEffectInfoDisplay key={index} info={effect} />;
                        })}
                    </>
                );
            }
            break;
        }
        case 'spells': {
            const spellBook = info.spellBook;
            if (spellBook && spellBook.knownSpells.length > 0) {
                return (
                    <>
                        {spellBook.knownSpells.map((spell, index) => {
                            return <SpellInfoDisplay key={index} info={spell} />;
                        })}
                    </>
                );
            }
            break;
        }
        case 'weaponry': {
            const { weaponry } = info;
            if (weaponry && weaponry.length > 0) {
                return (
                    <>
                        {weaponry.map((weapon, index) => {
                            return <WeaponInfoDisplay key={index} info={weapon} />;
                        })}
                    </>
                );
            }
            break;
        }
        case 'attributes': {
            const { attributes } = info;
            if (attributes) {
                return <AttributeDisplay attributes={attributes} ignore={flags?.ignoreAttributes || []} />;
            }
            break;
        }
        case 'misc': {
            return (
                <div className={'flex w-full flex-col gap-1'}>
                    <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                        <p className={'text-center text-xl'}>{t('misc.memories.title')}</p>
                        {info?.memory && Object.keys(info.memory).length > 0 ? (
                            <ComponentMemoriesDisplay memories={info.memory} />
                        ) : (
                            <p className={'text-center text-sm italic text-gray-400'}>{t('misc.memories.empty')}</p>
                        )}
                    </div>
                    <Separator />
                    <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                        <p className={'text-center text-xl'}>{t('misc.tags.title')}</p>
                        {info.tags && info.tags.length > 0 ? (
                            <TagsDisplay tags={info.tags} />
                        ) : (
                            <p className={'text-center text-sm italic text-gray-400'}>{t('misc.tags.empty')}</p>
                        )}
                    </div>
                </div>
            );
        }
        default: {
            console.log('Default value was triggered with this:', type);
            break;
        }
    }

    return <EmptyMenuContent />;
};

const FeatureContainer = ({ type, info, flags }: FeatureProps) => {
    return (
        <div id={`${type}-container`} className={'flex flex-col gap-4'}>
            <FeatureContainerContent type={type} info={info} flags={flags} />
        </div>
    );
};

export default FeatureContainer;
