import { FC } from 'react';
import { FaCheck, FaCheckDouble } from 'react-icons/fa';
import { ImCross } from 'react-icons/im';
import { MdOutlineGroupRemove, MdOutlineLockClock } from 'react-icons/md';

import UserAvatar from '@components/UserAvatars';
import { MutationButton } from '@components/ui/button';
import CommaSeparatedList from '@components/ui/coma-separated-list';
import StyledLink from '@components/ui/styled-link';
import useDualTranslation from '@hooks/useDualTranslation';
import { iLobbyInformation, iLobbyPlayerInfo } from '@models/api-data';
import { useApproveUserMutation } from '@mutations/lobby-overview/useApproveUser';
import useRemoveLobbyMember from '@mutations/lobby-overview/useRemoveLobbyMember';
import useMe from '@queries/useMe';
import { Route as ViewCharacterRoute } from '@router/_auth_only/lobby-rooms/$lobbyId/view-character';

const LinkToPlayerCharacter: FC<{
    descriptor: string;
    name: string;
}> = ({ descriptor, name }) => {
    return (
        <StyledLink
            to={ViewCharacterRoute.to}
            search={{
                character: descriptor,
            }}
        >
            {name} ({descriptor})
        </StyledLink>
    );
};

interface iPlayerDisplay {
    player: iLobbyPlayerInfo;
    layout: iLobbyInformation['layout'];
    lobbyId: string;
    isApproved: boolean;
}

const PlayerDisplay: FC<iPlayerDisplay> = ({
    player: { userId, nickname, characters },
    layout,
    lobbyId,
    isApproved,
}) => {
    const { t } = useDualTranslation('local', { keyPrefix: 'lobby-info.players' });
    const { user } = useMe();
    const { mutate: approveUser, isPending: isApprovalPending } = useApproveUserMutation();
    const { removeLobbyMember, isPending: isDeletionPending } = useRemoveLobbyMember();

    return (
        <div className="mb-4 flex w-full space-x-2">
            <UserAvatar userId={userId} className={'size-10 border-2 shadow-none'} />
            <div className={'w-full max-w-[90%]'}>
                <span className="flex flex-row gap-1 font-medium">
                    {nickname}
                    <span className={'m-1 flex text-sm text-muted-foreground'}>
                        {isApproved ? (
                            <FaCheckDouble className={'inline-block'} />
                        ) : (
                            <MdOutlineLockClock className={'inline-block'} />
                        )}
                    </span>
                </span>
                <span className="flex flex-row gap-1 text-sm text-muted-foreground">
                    {t('playing-as')}{' '}
                    <CommaSeparatedList
                        items={characters}
                        renderItem={([descriptor, name]) => (
                            <LinkToPlayerCharacter descriptor={descriptor} name={t(name, { includePrefix: false })} />
                        )}
                        emptyMessage={t('no-characters')}
                    />
                </span>
            </div>
            {layout === 'gm' ? (
                <div className={'flex flex-row gap-2'}>
                    {!isApproved ? (
                        <MutationButton
                            className={'h-8 text-sm'}
                            mutate={() => {
                                if (user?.id === userId || !lobbyId) return;
                                return approveUser({ lobbyId, userId });
                            }}
                            isPending={isApprovalPending}
                        >
                            <FaCheck className={'inline-block'} />
                        </MutationButton>
                    ) : null}
                    <MutationButton
                        mutate={() => {
                            if (user?.id === userId || !lobbyId) return;
                            return removeLobbyMember({ lobbyId, userId });
                        }}
                        className={'h-8 text-sm'}
                        variant={'destructiveGhost'}
                        disabled={user?.id === userId}
                        isPending={isDeletionPending}
                    >
                        {isApproved ? (
                            <MdOutlineGroupRemove className={'inline-block'} />
                        ) : (
                            <ImCross className={'inline-block'} />
                        )}
                    </MutationButton>
                </div>
            ) : null}
        </div>
    );
};

export default PlayerDisplay;
