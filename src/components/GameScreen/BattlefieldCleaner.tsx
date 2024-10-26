import { useSelector } from 'react-redux'
import { selectActions, selectActiveEntity } from '@redux/slices/gameScreenSlice'
import { useEffect } from 'react'
import { useBattlefieldContext } from '@context/BattlefieldContext'

const BattlefieldCleaner = () => {
    /*
    This component is responsible for cleaning up the battlefield in case responsible components are unmounted.
     */
    const actions = useSelector(selectActions)
    const activeCharacter = useSelector(selectActiveEntity)
    const { setActiveSquares, resetActiveSquares, resetInteractableSquares, resetClickedSquares } = useBattlefieldContext()

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

export default BattlefieldCleaner
