import { CharacterDisplayPlaceholder, GameWikiSettings } from '@components/CharacterDisplay'
import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo'
import CharacterEditableInfoAdapter from '@components/CharacterDisplay/CharacterEditableInfoAdapter'
import { PseudoCategoryContent } from '@components/GameWiki/PseudoCategoryContent'
import {
    ItemEditableInfoAdapter,
    SpellEditableInfoAdapter,
    StatusEffectEditableInfoAdapter,
    WeaponEditableInfoAdapter,
} from '@components/InfoDisplay/EditableInfoAdapter'
import {
    ItemInfoDisplayPlaceholder,
    SpellInfoDisplayPlaceholder,
    StatusEffectInfoDisplayPlaceholder,
    WeaponInfoDisplayPlaceholder,
} from '@components/InfoDisplay/InfoDisplayPlaceholder'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion'
import { useDataContext } from '@context/GameDataProvider'
import { useGameWikiContext } from '@context/GameWikiContext'
import { FC, useEffect } from 'react'

interface iCategoryContent {
    category: string
}

const PLACEHOLDER_CLASSNAME = 'flex flex-col gap-4 rounded border-2 p-4'
const CONTENT_DIV_CLASSNAME = 'grid grid-cols-2 gap-6 overflow-x-auto'

const CategoryContent: FC<iCategoryContent> = ({ category }) => {
    const { dlc } = useGameWikiContext()
    const {
        items,
        spells,
        weapons,
        characters: characters,
        statusEffects,
        fetchAndSetItems,
        fetchAndSetCharacters,
        fetchAndSetSpells,
        fetchAndSetStatusEffects,
        fetchAndSetWeapons,
    } = useDataContext()

    useEffect(() => {
        switch (category) {
            case 'characters':
                fetchAndSetCharacters(dlc).then(() => {})
                break
            case 'spells':
                fetchAndSetSpells(dlc).then(() => {})
                break
            case 'items':
                fetchAndSetItems(dlc).then(() => {})
                break
            case 'weapons':
                fetchAndSetWeapons(dlc).then(() => {})
                break
            case 'statusEffects':
                fetchAndSetStatusEffects(dlc).then(() => {})
                break
        }
    }, [category, dlc])

    switch (category) {
        case 'characters':
            return (
                <div>
                    {characters === null ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <CharacterDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <Accordion type={'multiple'} className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(characters[dlc]).map(([descriptor, character], index) => {
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
                                            <CharacterEditableInfoAdapter
                                                character={character}
                                                className={
                                                    'flex w-full flex-col gap-4 rounded border-2 p-4 max-[960px]:w-full'
                                                }
                                                settings={GameWikiSettings}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    )}
                </div>
            )
        case 'spells':
            return (
                <div>
                    {spells === null ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <SpellInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(spells[dlc]).map(([descriptor, spell], index) => {
                                return <SpellEditableInfoAdapter info={spell} key={index} descriptor={descriptor} />
                            })}
                        </div>
                    )}
                </div>
            )
        case 'items':
            return (
                <div>
                    {items === null ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <ItemInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(items[dlc]).map(([descriptor, spell], index) => {
                                return <ItemEditableInfoAdapter info={spell} key={index} descriptor={descriptor} />
                            })}
                        </div>
                    )}
                </div>
            )
        case 'weapons':
            return (
                <div>
                    {weapons === null ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <WeaponInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(weapons[dlc]).map(([descriptor, spell], index) => {
                                return <WeaponEditableInfoAdapter info={spell} key={index} descriptor={descriptor} />
                            })}
                        </div>
                    )}
                </div>
            )
        case 'statusEffects':
            return (
                <div>
                    {statusEffects === null ? (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                            <StatusEffectInfoDisplayPlaceholder className={PLACEHOLDER_CLASSNAME} />
                        </div>
                    ) : (
                        <div className={CONTENT_DIV_CLASSNAME}>
                            {Object.entries(statusEffects[dlc]).map(([descriptor, spell], index) => {
                                return (
                                    <StatusEffectEditableInfoAdapter info={spell} key={index} descriptor={descriptor} />
                                )
                            })}
                        </div>
                    )}
                </div>
            )
        default:
            return <PseudoCategoryContent />
    }
}

export default CategoryContent
