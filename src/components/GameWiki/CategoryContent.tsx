import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo';
import CharacterInfoWithDescriptor from '@components/CharacterDisplay/CharacterInfoWithDescriptor';
import { PseudoCategoryContent } from '@components/GameWiki/PseudoCategoryContent';
import {
    ItemInfoDisplayPlaceholder,
    SpellInfoDisplayPlaceholder,
    StatusEffectInfoDisplayPlaceholder,
    WeaponInfoDisplayPlaceholder,
} from '@components/InfoDisplay/InfoDisplayPlaceholder';
import {
    ItemInfoDisplayWithDescriptor,
    SpellInfoDisplayWithDescriptor,
    StatusEffectInfoDisplayWithDescriptor,
    WeaponInfoDisplayWithDescriptor,
} from '@components/InfoDisplay/InfoDisplayWithDescriptor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { useGameWikiContext } from '@context/GameWikiContext';
import {
    useLoadedCharacters,
    useLoadedItems,
    useLoadedSpells,
    useLoadedStatusEffects,
    useLoadedWeapons,
} from '@queries/useLoadedGameData';
import { FC } from 'react';

interface iCategoryContent {
    category: string;
}

const PLACEHOLDER_CLASSNAME = 'flex flex-col gap-4 rounded border-2 p-4';
const CONTENT_DIV_CLASSNAME = 'grid grid-cols-2 gap-6 overflow-x-auto';

const CategoryContent: FC<iCategoryContent> = ({ category }) => {
    const { dlc } = useGameWikiContext();
    const { spells, isPending: isSpellPending } = useLoadedSpells(dlc);
    const { items, isPending: isItemPending } = useLoadedItems(dlc);
    const { weapons, isPending: isWeaponPending } = useLoadedWeapons(dlc);
    const { statusEffects, isPending: isStatusEffectPending } = useLoadedStatusEffects(dlc);
    const { characters, isPending: isCharacterPending } = useLoadedCharacters(dlc);

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
        default:
            return <PseudoCategoryContent />;
    }
};

export default CategoryContent;
