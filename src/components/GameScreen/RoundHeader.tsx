import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { selectRound } from '../../redux/slices/infoSlice'
import { selectPlayersTurn } from '../../redux/slices/turnSlice'

const RoundHeader = () => {
    const { t } = useTranslation()

    const isPlayerTurn = useSelector(selectPlayersTurn)
    const round = useSelector(selectRound)

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
