import {
    AreaEffectsOnBattlefieldEditable,
    CharacterDataEditable,
    CharacterDataEditableInCombat,
} from '@models/CombatEditorModels';
import { ControlledBy } from '@models/EditorConversion';
import { GameStateContainer } from '@models/GameModels';
import { RandomUtils } from '@utils';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

export const CONTROLLED_BY_PLAYER = (id: string): { type: 'player'; id: string } => ({ type: 'player', id });
export const CONTROLLED_BY_AI = (id: string): { type: 'ai'; id: string } => ({ type: 'ai', id });
export const CONTROLLED_BY_GAME_LOGIC = { type: 'game_logic' };

export type CombatEditorSaveType = {
    battlefield: CombatEditorContextType['battlefield'];
    turnOrder: CombatEditorContextType['turnOrder'];
    messages: GameStateContainer;
    round: CombatEditorContextType['round'];
    activeCharacterIndex: CombatEditorContextType['activeCharacterIndex'];
    areaEffects: CombatEditorContextType['areaEffects'];
};

export interface CombatEditorContextType {
    mode: 'save' | 'preset';
    round: number;
    battlefield: {
        [square: string]: CharacterDataEditableInCombat;
    };
    messages: GameStateContainer;
    turnOrder: Array<iTurnInOrder>;
    activeCharacterIndex: number;
    areaEffects: AreaEffectsOnBattlefieldEditable;

    addCharacter: (
        square: string,
        character: CharacterDataEditable,
        descriptor: string,
        control?: ControlledBy,
    ) => void;
    removeCharacter: (square: string) => void;
    updateCharacter: (square: string, character: CharacterDataEditable | CharacterDataEditableInCombat) => void;
    updateControl: (square: string, control: ControlledBy) => void;

    changeRound: (newRound: number) => void;
    changeTurnOrder: (newTurnOrder: Array<iTurnInOrder>) => void;
    addCharacterToTurnOrder: (characterId: string) => void;
    makeCharacterActive: (index: number) => void;

    addGameMessage: (message: GameStateContainer[number]) => void;
    deleteGameMessage: (index: number) => void;
    changeGameMessage: (index: number, message: GameStateContainer[number]) => void;

    setMode: (mode: CombatEditorContextType['mode']) => void;

    addAreaEffect: (areaEffect: AreaEffectsOnBattlefieldEditable[number]) => void;
    deleteAreaEffect: (index: number) => void;
    changeAreaEffect: (index: number, areaEffect: AreaEffectsOnBattlefieldEditable[number]) => void;

    changePreset: (newData: CombatEditorSaveType) => void;
    resetPreset: () => void;
}

interface iTurnInOrder {
    character: string;
    id: string; // id of TURN instance
    // possible to extends in future should turns become more complex
}

const createTurnInOrder = (character: string): iTurnInOrder => ({ character, id: RandomUtils.uuid() });

const CombatEditorContext = createContext<CombatEditorContextType | undefined>(undefined);

const CombatEditorContextProvider = ({ children }: { children: ReactNode }) => {
    const [battlefield, setBattlefield] = useState<CombatEditorContextType['battlefield']>({});
    const [round, setRound] = useState(0);
    const [turnOrder, setTurnOrder] = useState<CombatEditorContextType['turnOrder']>([]);
    const [activeCharacterIndex, setActiveCharacterIndex] = useState(0);
    const [messages, setMessages] = useState<GameStateContainer>([]);
    const [mode, setMode] = useState<CombatEditorContextType['mode']>('save');
    const [areaEffects, setAreaEffects] = useState<CombatEditorContextType['areaEffects']>([]);

    const addCharacter = useCallback(
        (square: string, character: CharacterDataEditable, descriptor: string, control?: ControlledBy) => {
            setBattlefield((prev) => {
                const [line, column] = square.split(',').map((n) => parseInt(n));
                return {
                    ...prev,
                    [square]: {
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
                        id_: crypto.randomUUID(),
                        controlInfo: control || CONTROLLED_BY_GAME_LOGIC,
                        square: { line, column },
                    },
                };
            });
        },
        [],
    );

    const removeCharacter = useCallback((square: string) => {
        setBattlefield((prev) => {
            const newBattlefield = { ...prev };
            delete newBattlefield[square];
            return newBattlefield;
        });
    }, []);

    const updateCharacter = useCallback((square: string, character: CharacterDataEditable) => {
        setBattlefield((prev) => {
            const [line, column] = square.split(',').map((n) => parseInt(n));
            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    ...character,
                    square: {
                        line,
                        column,
                    },
                },
            };
        });
    }, []);

    const updateControl = useCallback((square: string, control: ControlledBy) => {
        setBattlefield((prev) => {
            if (!prev[square]) {
                return prev;
            }

            return {
                ...prev,
                [square]: {
                    ...prev[square],
                    controlInfo: control,
                },
            };
        });
    }, []);

    const changePreset = useCallback((newData: CombatEditorSaveType) => {
        setBattlefield(newData.battlefield);
        setTurnOrder(newData.turnOrder);
        setRound(Math.max(newData.round, 0));
        setActiveCharacterIndex(
            newData.activeCharacterIndex >= 0 && newData.activeCharacterIndex < newData.turnOrder.length
                ? newData.activeCharacterIndex
                : 0,
        );
        setMessages(newData.messages ?? []);
        setAreaEffects(newData.areaEffects ?? []);
    }, []);

    const resetPreset = useCallback(() => {
        setBattlefield({});
    }, []);

    const changeRound = useCallback((newRound: number) => {
        setRound(newRound);
    }, []);

    const changeTurnOrder = useCallback((newTurnOrder: Array<iTurnInOrder>) => {
        // newTurnOrder contains IDs of turns, not characters
        setTurnOrder(newTurnOrder);
    }, []);

    const addCharacterToTurnOrder = useCallback((characterId: string) => {
        setTurnOrder((prev) => [...prev, createTurnInOrder(characterId)]);
    }, []);

    const makeCharacterActive = useCallback(
        (index: number) => {
            if (index < 0 || index >= turnOrder.length) {
                return;
            }
            setActiveCharacterIndex(index);
        },
        [turnOrder],
    );

    const addGameMessage = useCallback((message: GameStateContainer[number]) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    const deleteGameMessage = useCallback((index: number) => {
        setMessages((prev) => {
            const newMessages = [...prev];
            newMessages.splice(index, 1);
            return newMessages;
        });
    }, []);

    const changeGameMessage = useCallback((index: number, message: GameStateContainer[number]) => {
        setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[index] = message;
            return newMessages;
        });
    }, []);

    const addAreaEffect = useCallback((areaEffect: AreaEffectsOnBattlefieldEditable[number]) => {
        setAreaEffects((prev) => [...prev, areaEffect]);
    }, []);

    const deleteAreaEffect = useCallback((index: number) => {
        setAreaEffects((prev) => {
            const newAreaEffects = [...prev];
            newAreaEffects.splice(index, 1);
            return newAreaEffects;
        });
    }, []);

    const changeAreaEffect = useCallback((index: number, areaEffect: AreaEffectsOnBattlefieldEditable[number]) => {
        setAreaEffects((prev) => {
            const newAreaEffects = [...prev];
            newAreaEffects[index] = areaEffect;
            return newAreaEffects;
        });
    }, []);

    const context = useMemo(
        () => ({
            messages,
            activeCharacterIndex,
            addCharacter,
            addCharacterToTurnOrder,
            battlefield,
            changePreset,
            changeRound,
            changeTurnOrder,
            mode,
            makeCharacterActive,
            removeCharacter,
            resetPreset,
            round,
            setMode,
            turnOrder,
            updateCharacter,
            updateControl,

            addGameMessage,
            deleteGameMessage,
            changeGameMessage,

            areaEffects,
            addAreaEffect,
            deleteAreaEffect,
            changeAreaEffect,
        }),
        [
            messages,
            activeCharacterIndex,
            addCharacter,
            addCharacterToTurnOrder,
            battlefield,
            changePreset,
            changeRound,
            changeTurnOrder,
            mode,
            makeCharacterActive,
            removeCharacter,
            resetPreset,
            round,
            setMode,
            turnOrder,
            updateCharacter,
            updateControl,

            addGameMessage,
            deleteGameMessage,
            changeGameMessage,

            areaEffects,
            addAreaEffect,
            deleteAreaEffect,
            changeAreaEffect,
        ],
    );

    return <CombatEditorContext.Provider value={context}>{children}</CombatEditorContext.Provider>;
};

const useCombatEditorContext = () => {
    const context = useContext(CombatEditorContext);
    if (context === undefined) {
        throw new Error('useCombatEditorContext must be used within a ViewCharactersContextProvider');
    }
    return context;
};

export { CombatEditorContextProvider, useCombatEditorContext };
