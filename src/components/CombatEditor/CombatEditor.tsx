import { CombatEditorProvider, useCombatEditor } from '@context/combat-editor';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlay } from 'react-icons/fa';
import { MdOutlineVideogameAssetOff } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import { toastError } from '@components/toastifications';
import { Button } from '@components/ui/button';
import useThisLobby from '@queries/useThisLobby';
import { Route as LobbyRoomRoute } from '@router/_auth_only/lobby-rooms/$lobbyId';
import { Route as GameRoomRoute } from '@router/_auth_only/lobby-rooms/$lobbyId/game-rooms/$gameId';
import APIService from '@services/APIService';
import { EditorHelpers } from '@utils';

import { AddNewCharacter } from './AddNewCharacter';
import { EditCharacterOnSquare } from './EditCharacterOnSquare';
import BattlefieldSectionEditor from './battlefield-section-editor';
import styles from './dotted-background.module.css';
import RoundInfoEditor from './round-header';

interface PresetDetails {
    nickName: string;
    lobbyID: string;
    presetID: string;
}

const CombatEditor = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { lobby } = useThisLobby();

    const { battlefield, resetPreset, turnOrder, activeCharacterIndex, round, messages, areaEffects, meta } =
        useCombatEditor();

    const [clickedSquare, setClickedSquare] = useState<string | null>(null);
    const [presetDetails] = useState<PresetDetails | null>(null);

    const resetCombatEditor = useCallback(() => {
        resetPreset();
    }, [resetPreset]);

    const handlePlayButton = useCallback(async () => {
        try {
            const { combat_id } = await APIService.createLobbyCombat(
                lobby.lobbyId,
                meta.nickname,
                EditorHelpers.convertGameEditorSaveToExportable({
                    areaEffects,
                    battlefield,
                    turnOrder,
                    activeCharacterIndex,
                    round,
                    messages,
                }),
            );
            await navigate({
                to: GameRoomRoute.to,
                params: {
                    lobbyId: lobby.lobbyId,
                    gameId: combat_id,
                },
            });
        } catch (e) {
            if (e instanceof AxiosError) {
                toastError(t('Something went wrong during save handling'), e.response?.data.message);
                console.log(e.response?.data);
            } else {
                console.error(e);
            }
        }
    }, [
        t,
        navigate,

        lobby,

        resetCombatEditor,

        battlefield,
        meta.nickname,
        areaEffects,
        turnOrder,
        activeCharacterIndex,
        round,
        messages,
    ]);

    return (
        <div className={'flex h-screen max-h-screen w-screen flex-row'}>
            <div
                className={`max-w-2/3 relative flex h-full w-full flex-col items-center gap-3 pt-8 ${styles.dottedBackground}`}
            >
                <RoundInfoEditor style={{ width: 'calc(var(--tile-size) * 8)' }} />
                <BattlefieldSectionEditor setClickedSquare={setClickedSquare} />
            </div>
            <div className={'max-w-1/3 relative flex h-screen w-full flex-col bg-white'}>
                <div className={'text-t-4xl flex h-20 w-full flex-row items-center bg-black px-4'}>
                    <div className={'flex w-full max-w-[90%] flex-row items-center justify-center gap-2'}>
                        <p
                            className={'h-full w-full truncate text-center text-2xl text-white'}
                            title={presetDetails?.nickName || 'Untitled Combat'}
                        >
                            {presetDetails?.nickName || 'Untitled Combat'}
                        </p>
                        <Button
                            className={'size-12 p-3 text-2xl'}
                            variant={'outline'}
                            onClick={() => {
                                handlePlayButton().then();
                            }}
                        >
                            <FaPlay />
                        </Button>
                        <Button variant={'outline'} className={'size-12 p-3 text-2xl'} onClick={resetCombatEditor}>
                            <RiDeleteBin6Line />
                        </Button>
                    </div>
                    <div className={'flex w-full flex-row justify-end gap-2'}>
                        <Button
                            variant={'outline'}
                            className={'size-12 p-3 text-2xl'}
                            onClick={() =>
                                navigate({
                                    to: LobbyRoomRoute.to,
                                    params: {
                                        lobbyId: lobby.lobbyId,
                                    },
                                })
                            }
                        >
                            <MdOutlineVideogameAssetOff />
                        </Button>
                    </div>
                </div>
                <div className={'no-visible-scrollbar flex h-screen grow flex-col overflow-auto p-4'}>
                    <div className={'flex size-full'}>
                        <div className={'w-full'}>
                            {clickedSquare ? (
                                <div>
                                    {(clickedSquare ? battlefield[clickedSquare] : null) ? (
                                        <EditCharacterOnSquare clickedSquare={clickedSquare} />
                                    ) : (
                                        <AddNewCharacter clickedSquare={clickedSquare} />
                                    )}
                                </div>
                            ) : (
                                <CharacterDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4'} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CharacterEditorWithContext = () => {
    const { lobbyId } = useThisLobby();

    if (!lobbyId) {
        return null;
    }

    return (
        <CombatEditorProvider lobbyId={lobbyId}>
            <CombatEditor />
        </CombatEditorProvider>
    );
};

export default CharacterEditorWithContext;
