import { ActionContextProvider, iActionContext } from '@context/ActionContext';
import { BattlefieldContextProvider, useBattlefieldContext } from '@context/BattlefieldContext';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';

import Battlefield from '@components/Battlefield/Battlefield';
import GameUtilityComponent from '@components/GameScreen/GameUtilityComponent';
import AOEEffectsDisplay from '@components/GameScreen/aoe-effects-display';
import { Separator } from '@components/ui/separator';
import { actionsAtom } from '@jotai-atoms/actions-atom';
import { aoeAtom, battlefieldAtom, timestampAtom } from '@jotai-atoms/battlefield-atom';

import styles from './GameScreen.module.css';
import MenuContainer from './MenuContainer/MenuContainer';
import MenuNavigator from './MenuNavigator/MenuNavigator';
import RoundHeader from './round-header';

const BattlefieldSection = () => {
    const { changeBattlefield } = useBattlefieldContext();
    const battlefield = useAtomValue(battlefieldAtom);
    const aoeEffects = useAtomValue(aoeAtom);
    const actionTimestamp = useAtomValue(timestampAtom);

    useEffect(() => {
        changeBattlefield({
            pawns: battlefield,
            effects: aoeEffects,
        });
    }, [battlefield, aoeEffects, changeBattlefield]);

    return <Battlefield separatorTimestamp={actionTimestamp} />;
};

const GameScreen = ({ setActionOutput }: { setActionOutput?: iActionContext['setOutput'] }) => {
    const [chosen, setChosen] = useState<string | null>(null);
    const actions = useAtomValue(actionsAtom);

    return (
        <div className={styles.gameScreenContainer}>
            <BattlefieldContextProvider>
                <div className={styles.gameInfoContainer}>
                    <RoundHeader />
                    <div className={'flex flex-row items-center gap-2'}>
                        <AOEEffectsDisplay />
                        <Separator orientation={'vertical'} className={'w-1 rounded-lg'} />
                        <BattlefieldSection />
                    </div>
                </div>
                <div className={styles.gameMenusContainer}>
                    <div className={styles.menuContainer}>
                        <ActionContextProvider actions={actions} setOutput={setActionOutput ?? ((_) => {})}>
                            <MenuContainer chosen={chosen} setChosen={setChosen} />
                        </ActionContextProvider>
                    </div>
                    <div className={styles.menuNavigation}>
                        <MenuNavigator setChosen={setChosen} />
                    </div>
                </div>
                <GameUtilityComponent />
            </BattlefieldContextProvider>
        </div>
    );
};

export default GameScreen;
