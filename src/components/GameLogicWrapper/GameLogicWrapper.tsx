import { useNavigate } from '@tanstack/react-router';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import ConnectedPlayersSection from '@components/GameLogicWrapper/ConnectedPlayersSection';
import GameScreen from '@components/GameScreen/GameScreen';
import Overlay from '@components/Overlay';
import { ThreeInOneSpinner } from '@components/Spinner';
import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { iActionContext } from '@context/ActionContext';
import useThisLobby from '@queries/useThisLobby';
import { resetGameScreenSlice, selectGameFlow, setActions } from '@redux/slices/gameScreenSlice';
import { AppDispatch } from '@redux/store';
import SocketService from '@services/SocketService';

interface GameLogicWrapperProps {
    lobbyId: string;
    gameId: string;
}

const GameLogicWrapper: FC<GameLogicWrapperProps> = ({ lobbyId, gameId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [actionOutput, setActionOutput] = useState<iActionContext['choices'] | null>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();

    const gameFlow = useSelector(selectGameFlow);
    const { lobby } = useThisLobby();

    useEffect(() => {
        if (!lobbyId || !gameId) {
            // if (somehow) lobbyId or gameId is not set, we leave the page before anything bad happens
            dispatch(resetGameScreenSlice());
            navigate({
                to: '..',
            });
            return;
        }
        dispatch(setActions(null));
        SocketService.connect({
            lobbyId,
            combatId: gameId,
            isGm: lobby.layout === 'gm',
        });
    }, [gameId, t, navigate]);

    useEffect(() => {
        if (actionOutput) {
            dispatch(setActions(null));
            SocketService.emit('take_action', actionOutput);
        }
    }, [actionOutput]);

    const navigateToLobby = useCallback(() => {
        if (!lobbyId) {
            return;
        }
        SocketService.disconnect();
        navigate({
            to: '/lobby-rooms/$lobbyId',
            params: {
                lobbyId,
            },
        });
    }, [lobbyId, navigate]);

    switch (gameFlow?.type) {
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
                        <p className={'text-xl italic'}>{t(gameFlow.details || 'local:game.pending.waiting_text')}</p>
                        <div className={'flex flex-row gap-4'}>
                            <Button variant={'secondary'} onClick={navigateToLobby}>
                                {t('local:game.pending.exit')}
                            </Button>
                            {lobby.layout === 'gm' ? (
                                <Button
                                    onClick={() => {
                                        SocketService.emit('start_combat');
                                    }}
                                >
                                    {t('local:game.pending.start')}
                                </Button>
                            ) : null}
                        </div>
                        <Separator />
                        <ConnectedPlayersSection />
                    </div>
                </Overlay>
            );
        case 'active':
            return (
                <GameScreen
                    setActionOutput={(output) => {
                        setActionOutput(output);
                    }}
                />
            );
        case 'ended':
            return (
                <Overlay>
                    <div className={'flex flex-col items-center justify-center gap-4'}>
                        <h1>{t('local:game.end.title')}</h1>
                        <h1>
                            {t('local:game.end.result', {
                                result: t(gameFlow.details) || t('local:game.end.no_winner_received'),
                            })}
                        </h1>
                        <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                    </div>
                </Overlay>
            );
        case 'aborted':
            return (
                <Overlay>
                    <div className={'flex flex-row items-center justify-center gap-4'}>
                        <h1>{t('local:game.end.aborted')}</h1>
                        <h2>{t(gameFlow.details || 'local:game.end.aborted_text')}</h2>
                        <Button onClick={navigateToLobby}>{t('local:game.end.exit')}</Button>
                    </div>
                </Overlay>
            );
        default:
            return (
                <Overlay>
                    <div className={'flex flex-row items-center justify-center gap-4'}>
                        <h1>{t('local:game.awaiting-flow.title')}</h1>
                        <ThreeInOneSpinner className={'5rem'} />
                    </div>
                </Overlay>
            );
    }
};

export default GameLogicWrapper;
