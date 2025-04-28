import { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCircle, FaUsers } from 'react-icons/fa';
import { LuGamepad } from 'react-icons/lu';

import { ButtonLink } from '@components/ui/button';
import CommaSeparatedList from '@components/ui/coma-separated-list';
import { Tooltip, TooltipContent, TooltipTrigger } from '@components/ui/tooltip';
import { iCombatInfo } from '@models/api-data';
import { cn } from '@utils';

const JoinTheCombat: FC<{ combatId: string; lobbyId: string; children: ReactNode; className?: string }> = ({
    combatId,
    lobbyId,
    children,
    className,
}) => {
    return (
        <ButtonLink
            className={className}
            to={`/lobby-rooms/$lobbyId/game-rooms/$gameId`}
            params={{ lobbyId, gameId: combatId }}
        >
            {children}
        </ButtonLink>
    );
};

interface iCombatDisplay {
    combat: iCombatInfo;
    lobbyId: string;
}

const CombatDisplay: FC<iCombatDisplay> = ({
    combat: { isActive, _id, activePlayers, nickname, roundCount },
    lobbyId,
}) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.combats',
    });

    return (
        <div className={'flex flex-col'}>
            <div className={'flex flex-row items-center justify-between'}>
                <div className={'flex flex-row items-center gap-2'}>
                    <FaCircle className={cn('h-5 w-5', isActive ? 'text-green-500' : 'text-amber-500')} />
                    <p className={'text-lg'}>{nickname}</p>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className={'flex flex-row items-center gap-1'}>
                                ({activePlayers?.length} <FaUsers className={'text-xl'} />)
                            </p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <CommaSeparatedList
                                items={activePlayers}
                                emptyMessage={t('no-players')}
                                renderItem={(item) => <p>{item.nickname}</p>}
                                className={cn(
                                    'flex flex-row',
                                    activePlayers?.length === 0 ? 'text-gray-500' : 'text-black',
                                )}
                            />
                        </TooltipContent>
                    </Tooltip>
                </div>
                <JoinTheCombat combatId={_id} lobbyId={lobbyId} className={'h-8 gap-2'}>
                    <LuGamepad />
                    {t('join')}
                </JoinTheCombat>
            </div>
            <p className={'flex flex-row text-gray-500'}>{t('round-count', { round: roundCount })}</p>
        </div>
    );
};

export default CombatDisplay;
