import {
    AreaEffectsOnBattlefieldEditable,
    CharacterDataEditable,
    CharacterDataEditableInCombat,
} from '@type-defs/combat-editor-models';
import { ControlledBy } from '@type-defs/editors-conversion';
import { GameStateContainer } from '@type-defs/game-types';
import { atom, useAtom } from 'jotai';
import { withImmer } from 'jotai-immer';
import { atomWithStorage, selectAtom } from 'jotai/utils';
import { createContext, type FC, ReactNode, useContext, useMemo } from 'react';

import { CONTROLLED_BY_GAME_LOGIC, RandomizeUtils } from '@utils';

export type CombatEditorSaveType = {
    battlefield: CombatEditorInstance['battlefield'];
    turnOrder: CombatEditorInstance['turnOrder'];
    messages: GameStateContainer;
    round: CombatEditorInstance['round'];
    activeCharacterIndex: CombatEditorInstance['activeCharacterIndex'];
    areaEffects: CombatEditorInstance['areaEffects'];
};

interface CombatEditorInstance {
    round: number;
    battlefield: {
        [square: string]: CharacterDataEditableInCombat;
    };
    messages: GameStateContainer;
    turnOrder: Array<iTurnInOrder>;
    activeCharacterIndex: number;
    areaEffects: AreaEffectsOnBattlefieldEditable;
}

interface iTurnInOrder {
    character: string;
    id: string; // id of TURN instance
    // possible to extends in future should turns become more complex
}

interface CombatEditorMeta {
    nickname: string;
}

const createInitialCombatEditorState = (): CombatEditorInstance => ({
    round: 0,
    battlefield: {},
    messages: [],
    turnOrder: [],
    activeCharacterIndex: 0,
    areaEffects: [],
});

const createInitialCombatEditorMeta = (): CombatEditorMeta => ({
    nickname: 'New Combat',
});

const createTurnInOrder = (character: string): iTurnInOrder => ({ character, id: RandomizeUtils.uuid() });

function createCombatEditorAtoms(lobbyId: string) {
    const presetAtom = withImmer(
        atomWithStorage<CombatEditorInstance>(`combat-editor-${lobbyId}`, createInitialCombatEditorState(), undefined, {
            getOnInit: true,
        }),
    );
    const presetMetaAtom = atomWithStorage<CombatEditorMeta>(
        `combat-editor-meta-${lobbyId}`,
        createInitialCombatEditorMeta(),
        undefined,
        { getOnInit: true },
    );

    const roundAtom = selectAtom(presetAtom, (state) => state.round);
    const battlefieldAtom = selectAtom(
        presetAtom,
        (state) => state.battlefield,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const messagesAtom = selectAtom(
        presetAtom,
        (state) => state.messages,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const turnOrderAtom = selectAtom(
        presetAtom,
        (state) => state.turnOrder,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );
    const activeCharacterIndexAtom = selectAtom(presetAtom, (state) => state.activeCharacterIndex);
    const areaEffectsAtom = selectAtom(
        presetAtom,
        (state) => state.areaEffects,
        (a, b) => JSON.stringify(a) === JSON.stringify(b),
    );

    const addCharacterAtom = atom(
        null,
        (
            _,
            set,
            {
                square,
                character,
                descriptor,
                control = CONTROLLED_BY_GAME_LOGIC(),
            }: {
                square: string;
                character: CharacterDataEditable;
                descriptor: string;
                control?: ControlledBy;
            },
        ) => {
            set(presetAtom, (prev) => {
                const [line, column] = square.split(',').map((n) => parseInt(n));
                prev.battlefield[square] = {
                    ...character,
                    attributes: {
                        ...character.attributes,
                        ...{
                            // dual attributes like these can be set to -1 in presets indicating that they should be set to their max value on load
                            'builtins:current_health':
                                character.attributes['builtins:current_health'] < 0
                                    ? character.attributes['builtins:max_health']
                                    : character.attributes['builtins:current_health'],
                            'builtins:current_action_points':
                                character.attributes['builtins:current_action_points'] < 0
                                    ? character.attributes['builtins:max_action_points']
                                    : character.attributes['builtins:current_action_points'],
                            'builtins:current_armor':
                                character.attributes['builtins:current_armor'] < 0
                                    ? character.attributes['builtins:base_armor']
                                    : character.attributes['builtins:current_armor'],
                        },
                    },
                    descriptor,
                    id_: RandomizeUtils.uuid(),
                    controlInfo: control,
                    square: { line, column },
                };
                return prev;
            });
        },
    );

    const removeCharacterAtom = atom(null, (_, set, square: string) => {
        set(presetAtom, (prev) => {
            delete prev.battlefield[square];
            return prev;
        });
    });

    const updateCharacterAtom = atom(null, (_, set, square: string, character: CharacterDataEditable) => {
        set(presetAtom, (prev) => {
            const { descriptor, controlInfo, id_, square: squareObject } = prev.battlefield[square];
            prev.battlefield[square] = {
                ...character,
                descriptor,
                controlInfo,
                id_,
                square: squareObject,
            };
            return prev;
        });
    });

    const updateControlAtom = atom(null, (_, set, square: string, control: ControlledBy) => {
        set(presetAtom, (prev) => {
            prev.battlefield[square].controlInfo = control;
            return prev;
        });
    });

    const changeRoundAtom = atom(null, (_, set, newRound: number) => {
        set(presetAtom, (prev) => {
            prev.round = newRound;
            return prev;
        });
    });

    const changeTurnOrderAtom = atom(null, (_, set, newTurnOrder: Array<iTurnInOrder>) => {
        set(presetAtom, (prev) => {
            prev.turnOrder = newTurnOrder;
            return prev;
        });
    });

    const addCharacterToTurnOrderAtom = atom(null, (_, set, characterId: string) => {
        set(presetAtom, (prev) => {
            prev.turnOrder.push(createTurnInOrder(characterId));
            return prev;
        });
    });

    const makeCharacterActiveAtom = atom(null, (_, set, index: number) => {
        set(presetAtom, (prev) => {
            prev.activeCharacterIndex = index;
            return prev;
        });
    });

    const addGameMessageAtom = atom(null, (_, set, message: GameStateContainer[number]) => {
        set(presetAtom, (prev) => {
            prev.messages.push(message);
            return prev;
        });
    });

    const deleteGameMessageAtom = atom(null, (_, set, index: number) => {
        set(presetAtom, (prev) => {
            delete prev.messages[index];
            return prev;
        });
    });

    const changeGameMessageAtom = atom(null, (_, set, index: number, message: GameStateContainer[number]) => {
        set(presetAtom, (prev) => {
            prev.messages[index] = message;
            return prev;
        });
    });

    const addAreaEffectAtom = atom(null, (_, set, areaEffect: AreaEffectsOnBattlefieldEditable[number]) => {
        set(presetAtom, (prev) => {
            prev.areaEffects.push(areaEffect);
            return prev;
        });
    });

    const deleteAreaEffectAtom = atom(null, (_, set, index: number) => {
        set(presetAtom, (prev) => {
            delete prev.areaEffects[index];
            return prev;
        });
    });

    const changeAreaEffectAtom = atom(
        null,
        (_, set, index: number, areaEffect: AreaEffectsOnBattlefieldEditable[number]) => {
            set(presetAtom, (prev) => {
                prev.areaEffects[index] = areaEffect;
                return prev;
            });
        },
    );

    const changePresetAtom = atom(null, (_, set, newData: CombatEditorSaveType) => {
        set(presetAtom, (prev) => {
            prev.battlefield = newData.battlefield;
            prev.turnOrder = newData.turnOrder;
            prev.round = Math.max(newData.round, 0);
            prev.activeCharacterIndex =
                newData.activeCharacterIndex >= 0 && newData.activeCharacterIndex < newData.turnOrder.length
                    ? newData.activeCharacterIndex
                    : 0;
            prev.messages = newData.messages ?? [];
            prev.areaEffects = newData.areaEffects ?? [];
            return prev;
        });
    });

    const resetPresetAtom = atom(null, (_, set) => {
        set(presetAtom, createInitialCombatEditorState());
    });

    const changePresetMetaAtom = atom(null, (_, set, newMeta: CombatEditorMeta) => {
        set(presetMetaAtom, newMeta);
    });

    return {
        roundAtom,
        battlefieldAtom,
        messagesAtom,
        turnOrderAtom,
        activeCharacterIndexAtom,
        areaEffectsAtom,

        addCharacterAtom,
        removeCharacterAtom,
        updateCharacterAtom,
        updateControlAtom,

        changeRoundAtom,
        changeTurnOrderAtom,
        addCharacterToTurnOrderAtom,
        makeCharacterActiveAtom,

        addGameMessageAtom,
        deleteGameMessageAtom,
        changeGameMessageAtom,

        addAreaEffectAtom,
        deleteAreaEffectAtom,
        changeAreaEffectAtom,

        changePresetAtom,
        resetPresetAtom,

        presetMetaAtom,
        changePresetMetaAtom,
    };
}

type CombatEditorContextType = ReturnType<typeof createCombatEditorAtoms>;

const CombatEditorContext = createContext<CombatEditorContextType | undefined>(undefined);

interface CombatEditorProviderProps {
    lobbyId: string;
    children: ReactNode;
}

export const CombatEditorProvider: FC<CombatEditorProviderProps> = ({ children, lobbyId }) => {
    const atoms = useMemo(() => createCombatEditorAtoms(lobbyId), [lobbyId]);

    return <CombatEditorContext value={{ ...atoms }}>{children}</CombatEditorContext>;
};

export const useCombatEditorContext = () => {
    const context = useContext(CombatEditorContext);
    if (context === undefined) {
        throw new Error('useCombatEditor must be used within a combat-editorProvider.');
    }
    return context as CombatEditorContextType;
};

export function useCombatEditor() {
    const {
        roundAtom,
        battlefieldAtom,
        messagesAtom,
        turnOrderAtom,
        activeCharacterIndexAtom,
        areaEffectsAtom,
        addCharacterAtom,
        removeCharacterAtom,
        updateCharacterAtom,
        updateControlAtom,
        changeRoundAtom,
        changeTurnOrderAtom,
        addCharacterToTurnOrderAtom,
        makeCharacterActiveAtom,
        addGameMessageAtom,
        deleteGameMessageAtom,
        changeGameMessageAtom,
        addAreaEffectAtom,
        deleteAreaEffectAtom,
        changeAreaEffectAtom,
        changePresetAtom,
        resetPresetAtom,
        presetMetaAtom,
        changePresetMetaAtom,
    } = useCombatEditorContext();
    const [round] = useAtom(roundAtom);
    const [battlefield] = useAtom(battlefieldAtom);
    const [messages] = useAtom(messagesAtom);
    const [turnOrder] = useAtom(turnOrderAtom);
    const [activeCharacterIndex] = useAtom(activeCharacterIndexAtom);
    const [areaEffects] = useAtom(areaEffectsAtom);
    const [meta] = useAtom(presetMetaAtom);

    const [, addCharacter] = useAtom(addCharacterAtom);
    const [, removeCharacter] = useAtom(removeCharacterAtom);
    const [, updateCharacter] = useAtom(updateCharacterAtom);
    const [, updateControl] = useAtom(updateControlAtom);

    const [, changeRound] = useAtom(changeRoundAtom);
    const [, changeTurnOrder] = useAtom(changeTurnOrderAtom);
    const [, addCharacterToTurnOrder] = useAtom(addCharacterToTurnOrderAtom);
    const [, makeCharacterActive] = useAtom(makeCharacterActiveAtom);

    const [, addGameMessage] = useAtom(addGameMessageAtom);
    const [, deleteGameMessage] = useAtom(deleteGameMessageAtom);
    const [, changeGameMessage] = useAtom(changeGameMessageAtom);

    const [, addAreaEffect] = useAtom(addAreaEffectAtom);
    const [, deleteAreaEffect] = useAtom(deleteAreaEffectAtom);
    const [, changeAreaEffect] = useAtom(changeAreaEffectAtom);

    const [, changePreset] = useAtom(changePresetAtom);
    const [, resetPreset] = useAtom(resetPresetAtom);

    const [, changePresetMeta] = useAtom(changePresetMetaAtom);

    return {
        round,
        battlefield,
        messages,
        turnOrder,
        activeCharacterIndex,
        areaEffects,
        meta,

        addCharacter,
        removeCharacter,
        updateCharacter,
        updateControl,

        changeRound,
        changeTurnOrder,
        addCharacterToTurnOrder,
        makeCharacterActive,

        addGameMessage,
        deleteGameMessage,
        changeGameMessage,

        addAreaEffect,
        deleteAreaEffect,
        changeAreaEffect,

        changePreset,
        resetPreset,

        changePresetMeta,
    };
}

export function useCharacterOnSquareInEditor(square: string) {
    const { battlefieldAtom } = useCombatEditorContext();
    const characterAtom = useMemo(
        () =>
            selectAtom(
                battlefieldAtom,
                (state) => state[square],
                (a, b) => JSON.stringify(a) === JSON.stringify(b),
            ),
        [battlefieldAtom, square],
    );
    const [character] = useAtom(characterAtom);

    return character;
}

export function useCharacterByIdInEditor(id: string) {
    const { battlefieldAtom } = useCombatEditorContext();
    const characterAtom = useMemo(
        () =>
            selectAtom(
                battlefieldAtom,
                (state) => Object.values(state).find((character) => character.id_ === id),
                (a, b) => JSON.stringify(a) === JSON.stringify(b),
            ),
        [battlefieldAtom, id],
    );
    const [character] = useAtom(characterAtom);

    return character;
}
