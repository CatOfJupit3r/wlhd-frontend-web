import { ButtonLink, ButtonProps } from '@components/ui/button';
import { FC } from 'react';

interface iEnterLobbyButton extends ButtonProps {
    lobbyId: string;
}

const EnterLobbyButton: FC<iEnterLobbyButton> = ({ lobbyId, ...props }) => {
    return <ButtonLink to={`/lobby-rooms/$lobbyId`} params={{ lobbyId }} {...props} />;
};

export default EnterLobbyButton;
