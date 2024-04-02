import Battlefield from '../components/Battlefield/Battlefield'
import MenuSelector from '../components/MenuSelector/MenuSelector'
import MenuContainer from '../components/MenuContainer/MenuContainer'

const HALF_SCREEN_STYLE = {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
}

const GameTestPage = () => {

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
                <Battlefield />
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
                    <MenuSelector />
                </div>
            </div>
        </div>
    )
}

export default GameTestPage
