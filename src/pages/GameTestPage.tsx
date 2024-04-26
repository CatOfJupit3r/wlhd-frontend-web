import Battlefield from '../components/Battlefield/Battlefield'
import MenuNavigator from '../components/MenuNavigator/MenuNavigator'
import MenuContainer from '../components/MenuContainer/MenuContainer'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { resetTurnSlice } from '../redux/slices/turnSlice'

const HALF_SCREEN_STYLE = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
}

const GameTestPage = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(resetTurnSlice()) // to prevent any leftover state from previous games
    }, [dispatch])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <div
                style={{
                    ...HALF_SCREEN_STYLE,
                    width: '60%',
                    backgroundColor: 'black',
                    color: 'white',
                    flexDirection: 'column',
                }}
            >
                <h1>Round 1</h1>
                <Battlefield mode={'game'} />
            </div>
            <div
                style={{
                    ...HALF_SCREEN_STYLE,
                    width: '40%',
                    flexDirection: 'row',
                    backgroundColor: 'white',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        height: '100%',
                        width: '90%',
                        minWidth: 'fit-content',
                        justifyContent: 'center',
                        padding: '2vh',
                    }}
                >
                    <MenuContainer />
                </div>
                <div
                    style={{
                        backgroundColor: 'black',
                        height: '100%',
                        width: '10%',
                        minWidth: 'fit-content',
                    }}
                >
                    <MenuNavigator />
                </div>
            </div>
        </div>
    )
}

export default GameTestPage
