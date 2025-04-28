import { CharacterDataEditable, SpellEditable } from '@type-defs/CombatEditorModels';
import { atom, Provider, useAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { selectAtom } from 'jotai/utils';
import { createContext, ReactNode, useContext, useMemo } from 'react';

export interface CharacterEditorFlags {
    attributes?: {
        ignored?: Array<string>;
        nonEditable?: Array<string>;
    };

    exclude?: {
        name?: boolean;
        description?: boolean;
        sprite?: boolean;

        attributes?: boolean;
        inventory?: boolean;
        spellBook?: boolean;
        statusEffects?: boolean;
        weaponry?: boolean;
        misc?: boolean;
    };
}

interface CharacterProviderProps {
    character: CharacterDataEditable;
    flags: CharacterEditorFlags;
    children: ReactNode;
}

type CharacterComponentContainers = 'inventory' | 'weaponry' | 'spellBook' | 'statusEffects';
type ComponentByContainer<T extends CharacterComponentContainers> = T extends 'inventory'
    ? CharacterDataEditable['inventory'][number]
    : T extends 'weaponry'
      ? CharacterDataEditable['weaponry'][number]
      : T extends 'spellBook'
        ? SpellEditable
        : T extends 'statusEffects'
          ? CharacterDataEditable['statusEffects'][number]
          : never;

/**
 * Atom creator for the character editor
 * @param character
 */
function createCharacterAtoms(character: CharacterDataEditable) {
    const characterAtom = atomWithImmer(character);
    const attributesAtom = selectAtom(
        characterAtom,
        (state) => state.attributes,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const inventoryAtom = selectAtom(
        characterAtom,
        (state) => state.inventory,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const weaponryAtom = selectAtom(
        characterAtom,
        (state) => state.weaponry,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const spellBookAtom = selectAtom(
        characterAtom,
        (state) => state.spellBook,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const statusEffectsAtom = selectAtom(
        characterAtom,
        (state) => state.statusEffects,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const memoriesAtom = selectAtom(
        characterAtom,
        (state) => state.memory,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const tagsAtom = selectAtom(
        characterAtom,
        (state) => state.tags,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );

    const updateCharacterAtom = atom(null, (_, set, modifier: Partial<CharacterDataEditable>) => {
        set(characterAtom, (prevCharacter) => ({
            ...prevCharacter,
            ...modifier,
        }));
    });

    const updateCharacterDecorationsAtom = atom(
        null,
        (_, set, modifier: Partial<CharacterDataEditable['decorations']>) => {
            set(characterAtom, (prevCharacter) => {
                prevCharacter['decorations'] = {
                    ...prevCharacter['decorations'],
                    ...modifier,
                };
                return prevCharacter;
            });
        },
    );

    const changeCharacterAttributeAtom = atom(
        null,
        (
            _,
            set,
            modifier: {
                attribute: keyof CharacterDataEditable['attributes'];
                value: CharacterDataEditable['attributes'][string];
            },
        ) => {
            set(characterAtom, (prevCharacter) => {
                prevCharacter['attributes'][modifier.attribute] = modifier.value;
                return prevCharacter;
            });
        },
    );

    const updateSpellBookMaxActiveSpellsAtom = atom(
        null,
        (_, set, modifier: CharacterDataEditable['spellBook']['maxActiveSpells']) => {
            set(characterAtom, (prevCharacter) => {
                prevCharacter['spellBook']['maxActiveSpells'] = modifier;
                prevCharacter['spellBook']['knownSpells'].forEach((spell) => {
                    spell['isActive'] = false;
                });
                return prevCharacter;
            });
        },
    );

    const changeCharacterMemoriesAtom = atom(null, (_, set, modifier: Partial<CharacterDataEditable['memory']>) => {
        set(characterAtom, (prevCharacter) => {
            prevCharacter['memory'] = modifier as CharacterDataEditable['memory'];
            return prevCharacter;
        });
    });

    const changeCharacterTagsAtom = atom(null, (_, set, modifier: Partial<CharacterDataEditable['tags']>) => {
        set(characterAtom, (prevCharacter) => {
            prevCharacter['tags'] = modifier as CharacterDataEditable['tags'];
            return prevCharacter;
        });
    });

    function createRemoveFromContainersAtoms(container: CharacterComponentContainers) {
        return atom(null, (_, set, index: number) => {
            set(characterAtom, (prevCharacter) => {
                if (container === 'spellBook') {
                    prevCharacter[container].knownSpells = prevCharacter[container].knownSpells.filter(
                        (_, i) => i !== index,
                    );
                } else {
                    // @ts-expect-error typescript is not smart enough to know that `container` is a valid container
                    prevCharacter[container] = prevCharacter[container].filter(
                        (_, i) => i !== index,
                    ) as CharacterDataEditable[Exclude<typeof container, 'spellBook'>];
                }
                return prevCharacter;
            });
        });
    }

    function createUpdateComponentInContainerAtoms(container: CharacterComponentContainers) {
        return atom(
            null,
            (
                _,
                set,
                {
                    index,
                    component,
                }: {
                    index: number;
                    component: ComponentByContainer<typeof container>;
                },
            ) => {
                set(characterAtom, (prevCharacter) => {
                    if (container === 'spellBook') {
                        prevCharacter[container].knownSpells[index] = component as ComponentByContainer<'spellBook'>;
                    } else {
                        prevCharacter[container][index] = component as ComponentByContainer<typeof container>;
                    }
                    return prevCharacter;
                });
            },
        );
    }

    function createAddToContainersAtoms(container: CharacterComponentContainers) {
        return atom(null, (_, set, component: ComponentByContainer<typeof container>) => {
            set(characterAtom, (prevCharacter) => {
                if (container === 'spellBook') {
                    prevCharacter[container].knownSpells.push(component as ComponentByContainer<typeof container>);
                } else {
                    // @ts-expect-error typescript is not smart enough to know that `container` is a valid container
                    prevCharacter[container].push(component as ComponentByContainer<typeof container>);
                }
                return prevCharacter;
            });
        });
    }

    const removeFromInventoryAtom = createRemoveFromContainersAtoms('inventory');
    const removeFromWeaponryAtom = createRemoveFromContainersAtoms('weaponry');
    const removeFromSpellBookAtom = createRemoveFromContainersAtoms('spellBook');
    const removeFromStatusEffectAtom = createRemoveFromContainersAtoms('statusEffects');

    const updateItemInInventoryAtom = createUpdateComponentInContainerAtoms('inventory');
    const updateWeaponInWeaponryAtom = createUpdateComponentInContainerAtoms('weaponry');
    const updateSpellInSpellBookAtom = createUpdateComponentInContainerAtoms('spellBook');
    const updateStatusEffectInStatusEffectsAtom = createUpdateComponentInContainerAtoms('statusEffects');

    const addItemToInventoryAtom = createAddToContainersAtoms('inventory');
    const addWeaponToWeaponryAtom = createAddToContainersAtoms('weaponry');
    const addSpellToSpellBookAtom = createAddToContainersAtoms('spellBook');
    const addStatusEffectToStatusEffectsAtom = createAddToContainersAtoms('statusEffects');

    return {
        characterAtom,
        attributesAtom,
        inventoryAtom,
        weaponryAtom,
        spellBookAtom,
        statusEffectsAtom,
        memoriesAtom,
        tagsAtom,

        updateCharacterAtom,
        updateCharacterDecorationsAtom,
        changeCharacterAttributeAtom,
        changeCharacterMemoriesAtom,
        changeCharacterTagsAtom,

        removeFromInventoryAtom,
        removeFromWeaponryAtom,
        removeFromSpellBookAtom,
        removeFromStatusEffectAtom,

        updateItemInInventoryAtom,
        updateWeaponInWeaponryAtom,
        updateSpellInSpellBookAtom,
        updateStatusEffectInStatusEffectsAtom,

        addItemToInventoryAtom,
        addWeaponToWeaponryAtom,
        addSpellToSpellBookAtom,
        addStatusEffectToStatusEffectsAtom,

        updateSpellBookMaxActiveSpellsAtom,
    };
}

type CharacterAtomsType = ReturnType<typeof createCharacterAtoms>;

interface iCharacterEditorContext extends CharacterAtomsType {
    flags: CharacterEditorFlags;
}

const CharacterEditorContext = createContext<iCharacterEditorContext | null>(null);

/**
 * Provider for the character editor
 * @param character
 * @param children
 * @param flags
 */
export function CharacterEditorProvider({ character, children, flags }: CharacterProviderProps) {
    const characterAtoms = useMemo(() => createCharacterAtoms(character), [character.id_]);
    const value = useMemo(
        () => ({
            flags,
            ...characterAtoms,
        }),
        [flags, characterAtoms],
    );

    return (
        <Provider>
            <CharacterEditorContext.Provider value={value}>{children}</CharacterEditorContext.Provider>
        </Provider>
    );
}

/**
 * Hook to get the character atoms
 */
export function useCharacterEditorContext() {
    const atoms = useContext(CharacterEditorContext);
    if (!atoms) {
        throw new Error('useCharacterEditorContext must be used within a CharacterProvider');
    }
    return atoms;
}

// Little note about following hooks:
// Q: Why are there so many commented out returns from these hooks?
// A: Because of current code structure, these functions are not necessarily used from these hooks.
//    useCharacterEditorInventory, despite returning `removeItemFromInventory` and `addItemToInventory`,
//    is not used, as they are imported with other similar functions.
//    still, I kept them commented out in case I decide to use them in the future from these hooks.

/**
 * Hook that has all character atoms with pre-applied `useAtom` hook
 */
export function useCharacterEditor() {
    const {
        characterAtom,
        attributesAtom,
        inventoryAtom,
        weaponryAtom,
        spellBookAtom,
        statusEffectsAtom,
        flags,
        memoriesAtom,
        tagsAtom,
    } = useCharacterEditorContext();

    const [character] = useAtom(characterAtom);
    const [attributes] = useAtom(attributesAtom);
    const [inventory] = useAtom(inventoryAtom);
    const [weaponry] = useAtom(weaponryAtom);
    const [spellBook] = useAtom(spellBookAtom);
    const [statusEffects] = useAtom(statusEffectsAtom);
    const [memories] = useAtom(memoriesAtom);
    const [tags] = useAtom(tagsAtom);

    return {
        character,
        attributes,
        inventory,
        weaponry,
        spellBook,
        statusEffects,
        flags,
        memories,
        tags,
    };
}

export function useCharacterEditorRemoveActions() {
    const { removeFromInventoryAtom, removeFromWeaponryAtom, removeFromSpellBookAtom, removeFromStatusEffectAtom } =
        useCharacterEditorContext();

    const [, removeFromInventory] = useAtom(removeFromInventoryAtom);
    const [, removeFromWeaponry] = useAtom(removeFromWeaponryAtom);
    const [, removeFromSpellBook] = useAtom(removeFromSpellBookAtom);
    const [, removeFromStatusEffect] = useAtom(removeFromStatusEffectAtom);

    return {
        removeFromInventory,
        removeFromWeaponry,
        removeFromSpellBook,
        removeFromStatusEffect,
    };
}

export function useCharacterEditorUpdateActions() {
    const {
        // updateItemInInventoryAtom,
        // updateWeaponInWeaponryAtom,
        // updateSpellInSpellBookAtom,
        // updateStatusEffectInStatusEffectsAtom,
        // updateSpellBookMaxActiveSpellsAtom,
        changeCharacterAttributeAtom,
        changeCharacterMemoriesAtom,
        changeCharacterTagsAtom,
        updateCharacterDecorationsAtom,
    } = useCharacterEditorContext();

    // const [, updateItemInInventory] = useAtom(updateItemInInventoryAtom);
    // const [, updateWeaponInWeaponry] = useAtom(updateWeaponInWeaponryAtom);
    // const [, updateSpellInSpellBook] = useAtom(updateSpellInSpellBookAtom);
    // const [, updateStatusEffectInStatusEffects] = useAtom(updateStatusEffectInStatusEffectsAtom);
    // const [, updateSpellBookMaxActiveSpells] = useAtom(updateSpellBookMaxActiveSpellsAtom);
    const [, changeCharacterAttribute] = useAtom(changeCharacterAttributeAtom);
    const [, changeCharacterMemories] = useAtom(changeCharacterMemoriesAtom);
    const [, changeCharacterTags] = useAtom(changeCharacterTagsAtom);
    const [, updateCharacterDecorations] = useAtom(updateCharacterDecorationsAtom);

    return {
        // updateItemInInventory,
        // updateWeaponInWeaponry,
        // updateSpellInSpellBook,
        // updateStatusEffectInStatusEffects,
        // updateSpellBookMaxActiveSpells,
        changeCharacterAttribute,
        changeCharacterMemories,
        changeCharacterTags,
        updateCharacterDecorations,
    };
}

export function useCharacterEditorAddActions() {
    const {
        addItemToInventoryAtom,
        addWeaponToWeaponryAtom,
        addSpellToSpellBookAtom,
        addStatusEffectToStatusEffectsAtom,
    } = useCharacterEditorContext();

    const [, addItemToInventory] = useAtom(addItemToInventoryAtom);
    const [, addWeaponToWeaponry] = useAtom(addWeaponToWeaponryAtom);
    const [, addSpellToSpellBook] = useAtom(addSpellToSpellBookAtom);
    const [, addStatusEffectToContainers] = useAtom(addStatusEffectToStatusEffectsAtom);

    return {
        addItemToInventory,
        addWeaponToWeaponry,
        addSpellToSpellBook,
        addStatusEffectToContainers,
    };
}

export function useCharacterEditorInventory() {
    const {
        inventoryAtom,
        updateItemInInventoryAtom,
        // removeFromInventoryAtom,
        // addItemToInventoryAtom
    } = useCharacterEditorContext();

    const [inventory] = useAtom(inventoryAtom);
    const [, updateItemInInventory] = useAtom(updateItemInInventoryAtom);
    // const [, removeFromInventory] = useAtom(removeFromInventoryAtom);
    // const [, addItemToInventory] = useAtom(addItemToInventoryAtom);

    return {
        inventory,
        updateItemInInventory,
        // removeFromInventory,
        // addItemToInventory,
    };
}

export function useCharacterEditorWeaponry() {
    const {
        weaponryAtom,
        updateWeaponInWeaponryAtom,
        // removeFromWeaponryAtom,
        // addWeaponToWeaponryAtom
    } = useCharacterEditorContext();

    const [weaponry] = useAtom(weaponryAtom);
    const [, updateWeaponInWeaponry] = useAtom(updateWeaponInWeaponryAtom);
    // const [, removeFromWeaponry] = useAtom(removeFromWeaponryAtom);
    // const [, addWeaponToWeaponry] = useAtom(addWeaponToWeaponryAtom);

    return {
        weaponry,
        updateWeaponInWeaponry,
        // removeFromWeaponry,
        // addWeaponToWeaponry,
    };
}

export function useCharacterEditorSpellBook() {
    const {
        spellBookAtom,
        updateSpellInSpellBookAtom,
        updateSpellBookMaxActiveSpellsAtom,
        // removeFromSpellBookAtom,
        // addSpellToSpellBookAtom,
    } = useCharacterEditorContext();

    const [spellBook] = useAtom(spellBookAtom);
    const [, updateSpellInSpellBook] = useAtom(updateSpellInSpellBookAtom);
    const [, updateSpellBookMaxActiveSpells] = useAtom(updateSpellBookMaxActiveSpellsAtom);
    // const [, removeFromSpellBook] = useAtom(removeFromSpellBookAtom);
    // const [, addSpellToSpellBook] = useAtom(addSpellToSpellBookAtom);

    return {
        spellBook,
        updateSpellInSpellBook,
        updateSpellBookMaxActiveSpells,
        // removeFromSpellBook,
        // addSpellToSpellBook,
    };
}

export function useCharacterEditorStatusEffects() {
    const {
        statusEffectsAtom,
        updateStatusEffectInStatusEffectsAtom,
        // removeFromStatusEffectAtom,
        // addStatusEffectToStatusEffectsAtom,
    } = useCharacterEditorContext();

    const [statusEffects] = useAtom(statusEffectsAtom);
    const [, updateStatusEffectInStatusEffects] = useAtom(updateStatusEffectInStatusEffectsAtom);
    // const [, removeFromStatusEffect] = useAtom(removeFromStatusEffectAtom);
    // const [, addStatusEffectToContainers] = useAtom(addStatusEffectToStatusEffectsAtom);

    return {
        statusEffects,
        updateStatusEffectInStatusEffects,
        // removeFromStatusEffect,
        // addStatusEffectToContainers,
    };
}
