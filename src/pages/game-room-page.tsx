import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GameLogicWrapper from '@components/GameLogicWrapper/GameLogicWrapper';
import Overlay from '@components/Overlay';
import { TrueSpinner } from '@components/Spinner';
import { Route as LobbyRoomRoute } from '@router/_auth_only/lobby-rooms/$lobbyId/';
import TranslationService from '@services/translation-service';

interface GameRoomPageProps {
    lobbyId: string;
    gameId: string;
}

const GameRoomPage = ({ lobbyId, gameId }: GameRoomPageProps) => {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setLoadingTranslations(true);
            TranslationService.awaitTranslations().then(() => setLoadingTranslations(false));
        } catch (error) {
            console.log(error);
            navigate({
                to: LobbyRoomRoute.to,
                params: {
                    lobbyId,
                },
            });
        }
    }, []);

    return (
        <>
            {loadingTranslations ? (
                <Overlay>
                    <div className={'flex flex-row items-center justify-center gap-4'}>
                        <h1>{t('builtins:loading')}</h1>
                        <TrueSpinner size={3} />
                    </div>
                </Overlay>
            ) : (
                <GameLogicWrapper lobbyId={lobbyId} gameId={gameId} />
            )}
        </>
    );
};

export default GameRoomPage;
