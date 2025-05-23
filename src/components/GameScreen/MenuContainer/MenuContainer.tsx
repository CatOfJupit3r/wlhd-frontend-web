import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import ControlledCharactersInfo from '@components/GameScreen/ControlledCharactersInfo/ControlledCharactersInfo';
import { Separator } from '@components/ui/separator';

import ActionInput from '../ActionInput/ActionInput';
import GameMessagesFeed from '../GameMessages/GameMessagesFeed';
import GmOptionMenu from '../GmOptionMenu/GmOptionMenu';
import LeaveGameOverlay from '../LeaveGameOverlay/LeaveGameOverlay';

const GAME_MENUS = {
    YOUR_CHARACTERS: {
        key: 'your-characters',
        Component: ControlledCharactersInfo,
    },
    ACTION_SELECT: {
        key: 'action-select',
        Component: ActionInput,
    },
    HISTORY: {
        key: 'history',
        Component: GameMessagesFeed,
    },
    GM_SETTINGS: {
        key: 'gm-settings',
        Component: GmOptionMenu,
    },
};

const MenuContainer = ({ chosen, setChosen }: { chosen: string | null; setChosen: (value: string | null) => void }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.action_menus',
    });

    const ReportThisIssue = useCallback(() => {
        return <div>{t('report_this_issue')}</div>;
    }, []);

    const displayMenu = useCallback(() => {
        if (chosen === 'leave-game') {
            return <LeaveGameOverlay setChosen={setChosen} />;
        }
        let menu: (typeof GAME_MENUS)[keyof typeof GAME_MENUS] | undefined;
        if (!chosen) {
            menu = GAME_MENUS.YOUR_CHARACTERS;
        } else {
            menu = Object.values(GAME_MENUS).find((m) => m.key === chosen);
        }
        if (!menu) {
            return (
                <>
                    <h1 className={'w-full text-center text-2xl'}>{t('no_menu_available')}</h1>
                    <ReportThisIssue />
                </>
            );
        }
        return (
            <>
                <h1 className={'text-3.5xl mt-2 w-full text-center font-bold'}>{t(`${menu.key}`)}</h1>
                <Separator className={'mb-4'} />
                <menu.Component />
            </>
        );
    }, [chosen, t]);

    return <div className={'flex w-full flex-col gap-2'}>{displayMenu()}</div>;
};

export default MenuContainer;
