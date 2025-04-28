import { useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import GameLogicWrapper from '@components/GameLogicWrapper/GameLogicWrapper';
import Overlay from '@components/Overlay';
import { TrueSpinner } from '@components/Spinner';
import { Route as LobbyRoomRoute } from '@router/_auth_only/lobby-rooms/$lobbyId/';
import APIService from '@services/api-service';

interface GameRoomPageProps {
    lobbyId: string;
    gameId: string;
}

const GameRoomPage = ({ lobbyId, gameId }: GameRoomPageProps) => {
    const [loadingTranslations, setLoadingTranslations] = useState(true);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const loadTranslations = useCallback(async () => {
        const translations = await APIService.getTranslations([i18n.language, 'uk_UA'], ['builtins', 'nyrzamaer']);
        for (const language in translations) {
            if (translations[language] === null) continue;
            for (const dlc in translations[language]) {
                if (translations[language][dlc] === null) continue;
                i18n.addResourceBundle(language, dlc, translations[language][dlc], true, true);
            }
        }
        if (lobbyId) {
            const customTranslations = await APIService.getCustomLobbyTranslations(lobbyId);
            i18n.addResourceBundle(i18n.language, 'coordinator', customTranslations, true, true);
        }
    }, [i18n, lobbyId]);

    useEffect(() => {
        try {
            setLoadingTranslations(true);
            loadTranslations().then(() => setLoadingTranslations(false));
        } catch (error) {
            console.log(error);
            navigate({
                to: LobbyRoomRoute.to,
                params: {
                    lobbyId,
                },
            });
        }
    }, [i18n]);

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
