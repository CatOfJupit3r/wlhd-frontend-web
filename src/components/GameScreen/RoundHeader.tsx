import { selectCurrentRoundCount, selectIsYourTurn } from '@redux/slices/gameScreenSlice'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const RoundHeader = () => {
    const { t } = useTranslation()

    const isPlayerTurn = useSelector(selectIsYourTurn)
    const round = useSelector(selectCurrentRoundCount)

    return (
        <div>
            <h1>
                {isPlayerTurn
                    ? `${t('local:game.round_n', { round })}. ${t('local:game.its_your_turn')}`
                    : `${t('local:game.round_n', { round })}`}
            </h1>
        </div>
    )
}

export default RoundHeader
