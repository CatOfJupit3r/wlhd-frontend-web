import { selectCurrentRoundCount } from '@redux/slices/gameScreenSlice';
import { useTranslation } from 'react-i18next';
import { BiSolidTimer } from 'react-icons/bi';
import { useSelector } from 'react-redux';

import TurnOrderDisplay from '@components/GameScreen/turn-order-display';
import { Separator } from '@components/ui/separator';

const RoundHeader = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game',
    });

    // const isPlayerTurn = useSelector(selectIsYourTurn);
    const round = useSelector(selectCurrentRoundCount);

    return (
        <div
            className={`flex max-h-[100px] flex-row items-center justify-start gap-2 overflow-y-hidden p-3`}
            style={{
                width: 'calc(var(--tile-size) * 8)',
            }}
        >
            <h1 className={'flex flex-row items-center gap-2 text-4xl font-bold'}>
                <BiSolidTimer /> {round}
            </h1>
            <Separator orientation={'vertical'} className={'w-[3px]'} />
            <TurnOrderDisplay />
        </div>
    );
};

export default RoundHeader;
