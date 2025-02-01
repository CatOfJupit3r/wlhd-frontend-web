import { FC } from 'react';

interface iLobbyInformationHeader {
    header: string;
}

const LobbyInformationHeader: FC<iLobbyInformationHeader> = ({ header }) => {
    return (
        <div className={'flex flex-row justify-between'}>
            <h2>{header}</h2>
        </div>
    );
};

export default LobbyInformationHeader;
