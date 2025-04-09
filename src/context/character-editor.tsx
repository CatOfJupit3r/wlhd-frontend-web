import { CharacterDataEditable, SpellEditable } from '@models/CombatEditorModels';
import { atom, Provider, useAtom } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
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

/**
 * Hook that has all character atoms with pre-applied `useAtom` hook
 */
export function useCharacterEditor() {
    const {
        characterAtom,
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

        ...rest
    } = useCharacterEditorContext();

    const [character] = useAtom(characterAtom);
    const [, updateCharacter] = useAtom(updateCharacterAtom);
    const [, updateCharacterDecorations] = useAtom(updateCharacterDecorationsAtom);
    const [, changeCharacterAttribute] = useAtom(changeCharacterAttributeAtom);
    const [, changeCharacterMemories] = useAtom(changeCharacterMemoriesAtom);
    const [, changeCharacterTags] = useAtom(changeCharacterTagsAtom);

    const [, removeFromInventory] = useAtom(removeFromInventoryAtom);
    const [, removeFromWeaponry] = useAtom(removeFromWeaponryAtom);
    const [, removeFromSpellBook] = useAtom(removeFromSpellBookAtom);
    const [, removeFromStatusEffect] = useAtom(removeFromStatusEffectAtom);

    const [, updateItemInInventory] = useAtom(updateItemInInventoryAtom);
    const [, updateWeaponInWeaponry] = useAtom(updateWeaponInWeaponryAtom);
    const [, updateSpellInSpellBook] = useAtom(updateSpellInSpellBookAtom);
    const [, updateStatusEffectInStatusEffects] = useAtom(updateStatusEffectInStatusEffectsAtom);

    const [, addItemToInventory] = useAtom(addItemToInventoryAtom);
    const [, addWeaponToWeaponry] = useAtom(addWeaponToWeaponryAtom);
    const [, addSpellToSpellBook] = useAtom(addSpellToSpellBookAtom);
    const [, addStatusEffectToContainers] = useAtom(addStatusEffectToStatusEffectsAtom);

    const [, updateSpellBookMaxActiveSpells] = useAtom(updateSpellBookMaxActiveSpellsAtom);

    return {
        character,
        updateCharacter,
        updateCharacterDecorations,
        changeCharacterAttribute,
        changeCharacterMemories,
        changeCharacterTags,

        removeFromInventory,
        removeFromWeaponry,
        removeFromSpellBook,
        removeFromStatusEffect,

        updateItemInInventory,
        updateWeaponInWeaponry,
        updateSpellInSpellBook,
        updateStatusEffectInStatusEffects,

        addItemToInventory,
        addWeaponToWeaponry,
        addSpellToSpellBook,
        addStatusEffectToContainers,

        updateSpellBookMaxActiveSpells,

        ...rest,
    };
}
