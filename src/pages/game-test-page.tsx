import { createStore, Provider } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';

import GameScreen from '@components/GameScreen/GameScreen';
import { actionsAtom, isYourTurnAtom } from '@jotai-atoms/actions-atom';
import { aoeAtom, battlefieldAtom, timestampAtom } from '@jotai-atoms/battlefield-atom';
import { gameFlowAtom } from '@jotai-atoms/game-lobby-meta-atom';
import {
    characterOrderAtom,
    controlledCharactersAtom,
    gameMessagesAtom,
    roundAtom,
} from '@jotai-atoms/game-screen-atom';
import useThisLobby from '@queries/lobbies/use-this-lobby';
import TranslationService from '@services/translation-service';

import example_gamestate from '../mocks/game-state.json';

const GameTestPage = () => {
    const jotaiStore = useRef(createStore());
    const [loadedGameState, setLoadedGameState] = useState(false);
    const { lobbyId } = useThisLobby();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummySetActionOutput = useCallback((output: any) => {
        console.log('DummySetActionOutput', output);
    }, []);

    const setupExampleGameState = useCallback(async () => {
        if (lobbyId) {
            TranslationService.spawnCustomTranslations(lobbyId);
        }

        jotaiStore.current.set(battlefieldAtom, example_gamestate.battlefield.pawns);
        jotaiStore.current.set(aoeAtom, example_gamestate.battlefield.effects);
        jotaiStore.current.set(timestampAtom, Date.now());

        jotaiStore.current.set(roundAtom, example_gamestate.round.current);
        jotaiStore.current.set(characterOrderAtom, example_gamestate.round.order);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jotaiStore.current.set(controlledCharactersAtom, example_gamestate.controlledCharacters as any);
        jotaiStore.current.set(gameMessagesAtom, example_gamestate.messages);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jotaiStore.current.set(actionsAtom, example_gamestate.actions as any);
        jotaiStore.current.set(isYourTurnAtom, true);

        await TranslationService.awaitTranslations();

        jotaiStore.current.set(gameFlowAtom, {
            type: 'active',
            details: '',
        });
        setLoadedGameState(true);
    }, [lobbyId]);

    useEffect(() => {
        setupExampleGameState().then();
    }, [setupExampleGameState]);

    return (
        <Provider store={jotaiStore.current}>
            <div>{loadedGameState ? <GameScreen setActionOutput={dummySetActionOutput} /> : <div>Loading...</div>}</div>
        </Provider>
    );
};

export default GameTestPage;
