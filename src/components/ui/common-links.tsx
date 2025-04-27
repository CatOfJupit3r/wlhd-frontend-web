import { FC } from 'react';

import { ButtonLink, ButtonProps } from '@components/ui/button';

interface iEnterLobbyButton extends ButtonProps {
    lobbyId: string;
}

export const EnterLobbyButton: FC<iEnterLobbyButton> = ({ lobbyId, ...props }) => {
    return <ButtonLink to={`/lobby-rooms/$lobbyId`} params={{ lobbyId }} {...props} />;
};

interface iViewCharacterButton extends ButtonProps {
    lobbyId: string;
    character: string;
}

export const ViewCharacterButton: FC<iViewCharacterButton> = ({ lobbyId, character, ...props }) => {
    return (
        <ButtonLink
            to={`/lobby-rooms/$lobbyId/view-character`}
            params={{ lobbyId }}
            search={{
                character,
            }}
            {...props}
        />
    );
};
