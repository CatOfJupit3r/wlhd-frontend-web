import { FC } from 'react';

import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo';
import CharacterInfoWithDescriptor from '@components/CharacterDisplay/CharacterInfoWithDescriptor';
import { PseudoCategoryContent } from '@components/GameWiki/PseudoCategoryContent';
import {
    AreaEffectInfoDisplayPlaceholder,
    ItemInfoDisplayPlaceholder,
    SpellInfoDisplayPlaceholder,
    StatusEffectInfoDisplayPlaceholder,
    WeaponInfoDisplayPlaceholder,
} from '@components/InfoDisplay/InfoDisplayPlaceholder';
import {
    AreaEffectInfoDisplayWithDescriptor,
    ItemInfoDisplayWithDescriptor,
    SpellInfoDisplayWithDescriptor,
    StatusEffectInfoDisplayWithDescriptor,
    WeaponInfoDisplayWithDescriptor,
} from '@components/InfoDisplay/InfoDisplayWithDescriptor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { SupportedDLCs } from '@constants/game-support';
import {
    useLoadedAreaEffects,
    useLoadedCharacters,
    useLoadedItems,
    useLoadedSpells,
    useLoadedStatusEffects,
    useLoadedWeapons,
} from '@queries/useLoadedGameData';

interface iCategoryContent {
    category: 'characters' | 'spells' | 'items' | 'weapons' | 'statusEffects' | 'areaEffects' | null;
    dlc: SupportedDLCs;
}

const PLACEHOLDER_CLASSNAME = 'flex flex-col gap-4 rounded border-2 p-4';
const CONTENT_DIV_CLASSNAME = 'grid grid-cols-2 gap-6 overflow-x-auto';

const CategoryContent: FC<iCategoryContent> = ({ category, dlc }) => {
    const { spells, isPending: isSpellPending } = useLoadedSpells(dlc, category === 'spells');
    const { items, isPending: isItemPending } = useLoadedItems(dlc, category === 'items');
    const { weapons, isPending: isWeaponPending } = useLoadedWeapons(dlc, category === 'weapons');
    const { statusEffects, isPending: isStatusEffectPending } = useLoadedStatusEffects(
        dlc,
        category === 'statusEffects',
    );
    const { areaEffects, isPending: isAreaEffectPending } = useLoadedAreaEffects(dlc, category === 'areaEffects');
    const { characters, isPending: isCharacterPending } = useLoadedCharacters(dlc, category === 'characters');

    switch (category) {
        case 'characters':
            return (
                <div>
                    {isCharacterPending || !characters ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <Accordion type={'multiple'} className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(characters).map(([descriptor, character], index) => {
                                return (
                                    <AccordionItem value={descriptor} key={index} className={''}>
                                        <AccordionTrigger className={'hover:no-underline'}>
                                            <CharacterBasicInfo
                                                character={{
                                                    name: character.decorations.name,
                                                    description: character.decorations.description || null,
                                                    sprite: character.decorations.sprite,
                                                    square: null,
                                                }}
                                            />
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <CharacterInfoWithDescriptor dlc={dlc} descriptor={descriptor} />
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}
                </div>
            );
        case 'spells':
            return (
                <div>
                    {isSpellPending || !spells ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.keys(spells).map((descriptor, index) => {
                                return <SpellInfoDisplayWithDescriptor dlc={dlc} descriptor={descriptor} key={index} />;
                            })}
                        </div>
                    )}
                </div>
            );
        case 'items':
            return (
                <div>
                    {isItemPending || !items ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.keys(items).map((descriptor, index) => {
                                return <ItemInfoDisplayWithDescriptor dlc={dlc} descriptor={descriptor} key={index} />;
                            })}
                        </div>
                    )}
                </div>
            );
        case 'weapons':
            return (
                <div>
                    {isWeaponPending || !weapons ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.keys(weapons).map((descriptor, index) => {
                                return (
                                    <WeaponInfoDisplayWithDescriptor dlc={dlc} descriptor={descriptor} key={index} />
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        case 'statusEffects':
            return (
                <div>
                    {isStatusEffectPending || !statusEffects ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.keys(statusEffects).map((descriptor, index) => {
                                return (
                                    <StatusEffectInfoDisplayWithDescriptor
                                        dlc={dlc}
                                        descriptor={descriptor}
                                        key={index}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        case 'areaEffects':
            return (
                <div>
                    {isAreaEffectPending || !areaEffects ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <AreaEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <AreaEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <AreaEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <AreaEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.keys(areaEffects).map((descriptor, index) => {
                                return (
                                    <AreaEffectInfoDisplayWithDescriptor
                                        dlc={dlc}
                                        descriptor={descriptor}
                                        key={index}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        default:
            return <PseudoCategoryContent />;
    }
};

export default CategoryContent;
