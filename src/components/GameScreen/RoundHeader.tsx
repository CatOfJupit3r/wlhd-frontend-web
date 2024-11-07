import { selectCurrentRoundCount, selectIsYourTurn } from '@redux/slices/gameScreenSlice'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const RoundHeader = () => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game',
    })

    const isPlayerTurn = useSelector(selectIsYourTurn)
    const round = useSelector(selectCurrentRoundCount)

    return (
        <div>
            <h1 className={'text-t-bigger font-bold'}>
                {isPlayerTurn ? `${t('round_n', { round })}. ${t('its_your_turn')}` : `${t('round_n', { round })}`}
            </h1>
        </div>
    )
}

export default RoundHeader
