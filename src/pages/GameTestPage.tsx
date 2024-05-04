import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { resetTurnSlice } from '../redux/slices/turnSlice'
import GameScreen from '../components/GameScreen/GameScreen'


const GameTestPage = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(resetTurnSlice()) // to prevent any leftover state from previous games
    }, [dispatch])

    return (
        <GameScreen />
    )
}

export default GameTestPage
