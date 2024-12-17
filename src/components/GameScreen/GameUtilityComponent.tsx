import GameMessage from '@components/GameScreen/GameMessages/GameMessage'
import { useBattlefieldContext } from '@context/BattlefieldContext'
import { toast } from '@hooks/useToast'
import { selectActions, selectActiveCharacter, selectAllMessages } from '@redux/slices/gameScreenSlice'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

const GameUtilityComponent = () => {
    const actions = useSelector(selectActions)
    const activeCharacter = useSelector(selectActiveCharacter)
    const { setActiveSquares, resetActiveSquares, resetInteractableSquares, resetClickedSquares } =
        useBattlefieldContext()
    const { t } = useTranslation('local', {
        keyPrefix: 'game.utility',
    })
    const messages = useSelector(selectAllMessages)

    useEffect(() => {
        // in normal game, messages are being appended to the end of the array
        // so we don't need some fancy memoization here. simple last element check is enough
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            toast({
                title: t('new-message'),
                description: <GameMessage content={lastMessage} />,
                position: 'bottom-left',
                clickToDismiss: true,
            })
        }
    }, [messages])

    useEffect(() => {
        if (actions === null) {
            resetInteractableSquares()
            resetClickedSquares()
        }
    }, [actions])

    useEffect(() => {
        if (!activeCharacter || activeCharacter.square === null) {
            resetActiveSquares()
        } else {
            setActiveSquares(`${activeCharacter.square.line}/${activeCharacter.square.column}`)
        }
    }, [activeCharacter])

    return <div id={'battlefield-cleaner'} />
}

export default GameUtilityComponent
