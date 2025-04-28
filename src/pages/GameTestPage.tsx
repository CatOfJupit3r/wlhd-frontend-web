import { createStore, Provider } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import useThisLobby from '@queries/useThisLobby';
import APIService from '@services/APIService';

import example_gamestate from '../mocks/example_gamestate.json';

const GameTestPage = () => {
    const jotaiStore = useRef(createStore());
    const { i18n } = useTranslation();
    const [loadedGameState, setLoadedGameState] = useState(false);
    const { lobbyId } = useThisLobby();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummySetActionOutput = useCallback((output: any) => {
        console.log('DummySetActionOutput', output);
    }, []);

    const setupExampleGameState = useCallback(async () => {
        const promises: Array<Promise<unknown>> = [];
        if (lobbyId) {
            promises.push(
                APIService.getCustomLobbyTranslations(lobbyId).then((data) => {
                    i18n.addResourceBundle(i18n.language, 'coordinator', data, true, true);
                }),
            );
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

        await Promise.all(promises);

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
        // eslint-disable-next-line react-compiler/react-compiler
        <Provider store={jotaiStore.current}>
            <div>{loadedGameState ? <GameScreen setActionOutput={dummySetActionOutput} /> : <div>Loading...</div>}</div>
        </Provider>
    );
};

export default GameTestPage;
