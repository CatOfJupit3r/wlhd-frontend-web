import { iActionContext } from '@context/ActionContext';
import { useNavigate } from '@tanstack/react-router';
import { createStore, Provider, useAtomValue } from 'jotai';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConnectedPlayersSection from '@components/GameLogicWrapper/ConnectedPlayersSection';
import GameScreen from '@components/GameScreen/GameScreen';
import Overlay from '@components/Overlay';
import { ThreeInOneSpinner } from '@components/Spinner';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { actionsAtom } from '@jotai-atoms/actions-atom';
import { gameFlowAtom, lobbyStateAtom } from '@jotai-atoms/game-lobby-meta-atom';
import useThisLobby from '@queries/useThisLobby';
import SocketService from '@services/SocketService';

interface GameLogicWrapperProps {
    lobbyId: string;
    gameId: string;
}

const GameLogicWrapper: FC<GameLogicWrapperProps> = ({ lobbyId, gameId }) => {
    const jotaiStore = useRef(createStore());
    const connection = useRef<SocketService>(null);
    const { lobby } = useThisLobby();

    useEffect(() => {
        if (!gameId || !lobbyId) return;

        const socket = new SocketService(jotaiStore.current);
        connection.current = socket;
        socket.connect({
            lobbyId,
            combatId: gameId,
            isGm: lobby.layout === 'gm',
        });

        return () => {
            socket.disconnect();
        };
    }, [gameId, lobbyId]);

    const [actionOutput, setActionOutput] = useState<iActionContext['choices'] | null>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const flow = useAtomValue(gameFlowAtom, {
        // eslint-disable-next-line react-compiler/react-compiler
        store: jotaiStore!.current,
    });
    const gameLobbyState = useAtomValue(lobbyStateAtom, {
        // eslint-disable-next-line react-compiler/react-compiler
        store: jotaiStore!.current,
    });

    useEffect(() => {
        if (actionOutput) {
            jotaiStore.current.set(actionsAtom, null);
            connection.current?.emit('take_action', actionOutput);
        }
    }, [actionOutput]);

    const navigateToLobby = useCallback(() => {
        if (!lobbyId) {
            return;
        }
        connection.current?.disconnect();
        navigate({
            to: '/lobby-rooms/$lobbyId',
            params: {
                lobbyId,
            },
        });
    }, [lobbyId, navigate]);

    switch (flow?.type) {
        case 'pending':
            return (
                <Overlay>
                    <div
                        className={
                            'flex w-full max-w-3xl flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 text-black'
                        }
                    >
                        <div className={'flex flex-row items-center justify-center gap-3'}>
                            <h1>{t('local:game.pending.not_started')}</h1>
                            <ThreeInOneSpinner className={'size-14'} />
                        </div>
                        <p className={'text-xl italic'}>{t(flow.details || 'local:game.pending.waiting_text')}</p>
                        <div className={'flex flex-row gap-4'}>
                            <Button variant={'secondary'} onClick={navigateToLobby}>
                                {t('local:game.pending.exit')}
                            </Button>
                            {lobby.layout === 'gm' ? (
                                <Button
                                    onClick={() => {
                                        connection.current?.emit('start_combat');
                                    }}
                                >
                                    {t('local:game.pending.start')}
                                </Button>
                            ) : null}
                        </div>
                        <Separator />
                        <ConnectedPlayersSection gameLobbyState={gameLobbyState} />
                    </div>
                </Overlay>
            );
        case 'active':
            return (
                // eslint-disable-next-line react-compiler/react-compiler
                <Provider store={jotaiStore?.current}>
                    <GameScreen
                        setActionOutput={(output) => {
                            setActionOutput(output);
                        }}
                    />
                </Provider>
            );
        case 'ended':
            return (
                <Overlay>
                    <div className={'flex flex-col items-center justify-center gap-4'}>
                        <h1>{t('local:game.end.title')}</h1>
                        <h2>
                            {t('local:game.end.result', {
                                result: t(flow.details) || t('local:game.end.no_winner_received'),
                            })}
                        </h2>
                        <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                    </div>
                </Overlay>
            );
        case 'aborted':
            return (
                <Overlay>
                    <div className={'flex flex-col items-center justify-center gap-4'}>
                        <h1>{t('local:game.end.aborted')}</h1>
                        <h2>{t(flow.details || 'local:game.end.aborted_text')}</h2>
                        <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                    </div>
                </Overlay>
            );
        default:
            return (
                <Overlay>
                    <div className={'flex flex-col items-center justify-center gap-4'}>
                        <h1>{t('local:game.awaiting-flow.title')}</h1>
                        <ThreeInOneSpinner className={'5rem'} />
                    </div>
                </Overlay>
            );
    }
};

export default GameLogicWrapper;
