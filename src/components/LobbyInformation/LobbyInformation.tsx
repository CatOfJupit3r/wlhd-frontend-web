import { FC, useState } from 'react';

import ModalManager from '@components/LobbyInformation/Modals/ModalManager';
import { AlertDialog } from '@components/ui/alert-dialog';
import { iLobbyInformation } from '@models/api-data';

import ActiveCombatsList from './ActiveCombatsList';
import CharactersInLobby from './CharactersInLobby';
import LobbyInformationHeader from './LobbyInformationHeader';
import PlayersList from './PlayersList';
import { LOBBY_INFO_MODALS_TYPE } from './types';

interface iLobbyInformationProps {
    info: iLobbyInformation;
}

const LobbyInformation: FC<iLobbyInformationProps> = ({
    info: { name, players, combats, layout, lobbyId, characters, waitingApproval },
}) => {
    const [modalType, setModalType] = useState<LOBBY_INFO_MODALS_TYPE | null>(null);

    return (
        <AlertDialog open={modalType !== null} onOpenChange={(isOpen) => setModalType(isOpen ? modalType : null)}>
            <div className={'mx-auto flex w-full flex-col space-y-6 p-4 lg:max-w-[1400px]'}>
                <LobbyInformationHeader header={name} />
                <div className={'grid grid-cols-1 gap-6 md:grid-cols-2'}>
                    <PlayersList
                        className={'col-span-1'}
                        players={players}
                        layout={layout}
                        setModalType={setModalType}
                        lobbyId={lobbyId}
                        waitingPlayers={waitingApproval}
                    />
                    <ActiveCombatsList className={'col-span-1'} combats={combats} layout={layout} lobbyId={lobbyId} />
                </div>
                <CharactersInLobby characters={characters} lobbyId={lobbyId} />
            </div>
            <ModalManager current={modalType} setCurrent={setModalType} />
        </AlertDialog>
    );
};

export default LobbyInformation;
