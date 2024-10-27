import React from 'react'
import { CharacterInTurnOrder } from '@models/GameModels'
import { AppDispatch } from '@redux/store'
import { useDispatch } from 'react-redux'
import { RandomUtils } from '@utils'
import { setTurnOrder } from '@redux/slices/gameScreenSlice'
import { Button } from '@components/ui/button'

/*

This component is built for /game-test route and allows for better control over game state for testing purposes.

 */


const MOCK_TURN_ORDER_CHARACTERS: Array<CharacterInTurnOrder> = [
    {
        "descriptor" : "coordinator:hero",
        "decorations" : {
            "name" : "The Hero",
            "description" : "An ordinary farmer who gained the strongest power capable of defeating The Demon King.",
            "sprite" : "ally"
        },
        "square" : {
            "line" : 4,
            "column" : 5
        },
        "controlledByYou" : true,
        "id_": '1'
    },
    {
        "descriptor" : "builtins:target_dummy",
        "decorations" : {
            "name" : "builtins:characters.target_dummy.name",
            "description" : "builtins:characters.target_dummy.desc",
            "sprite" : "builtins:fire"
        },
        "square" : {
            "line" : 3,
            "column" : 3
        },
        "controlledByYou" : true,
        "id_": '2'
    },
    {
        "descriptor" : "builtins:target_dummy",
        "decorations" : {
            "name" : "builtins:characters.target_dummy.name",
            "description" : "builtins:characters.target_dummy.desc",
            "sprite" : "builtins:unavailable"
        },
        "square" : {
            "line" : 3,
            "column" : 4
        },
        "controlledByYou" : true,
        "id_": '3'
    },
    {
        "descriptor" : "builtins:target_dummy",
        "decorations" : {
            "name" : "builtins:characters.target_dummy.name",
            "description" : "builtins:characters.target_dummy.desc",
            "sprite" : "builtins:wind"
        },
        "square" : {
            "line" : 3,
            "column" : 5
        },
        "controlledByYou" : true,
        "id_": '4'
    },
    {
        "descriptor" : "builtins:target_dummy_large",
        "decorations" : {
            "name" : "builtins:characters.target_dummy_large.name",
            "description" : "builtins:characters.target_dummy_large.desc",
            "sprite" : "builtins:target_dummy"
        },
        "square" : {
            "line" : 3,
            "column" : 6
        },
        "controlledByYou" : true,
        "id_": '5'
    },
    {
        "controlledByYou": false,
        "descriptor" : "builtins:target_dummy",
        "decorations" : {
            "name" : "builtins:characters.target_dummy.name",
            "description" : "builtins:characters.target_dummy.desc",
            "sprite" : "builtins:target_dummy"
        },
        "square" : {
            "line" : 3,
            "column" : 2
        },
        "id_": "6"
    }
]

const RandomizeTurnOrder = () => {
    const dispatch = useDispatch<AppDispatch>()
    
    const handleRandomizeButtonClick = () => {
        const newOrder = [...MOCK_TURN_ORDER_CHARACTERS]
        const shuffled = newOrder.sort(() => 0.5 - Math.random())
        const howManyToPop = RandomUtils.randNumber(0, 2)
        for (let i = 0; i < howManyToPop; i++) {
            shuffled.pop()
        }
        const turnEndInx = RandomUtils.randNumber(0, shuffled.length - 1)
        const turnOrder = shuffled.slice(turnEndInx).concat(shuffled.slice(0, turnEndInx))
        dispatch(setTurnOrder(turnOrder))
    }

    return <Button onClick={handleRandomizeButtonClick}>Randomize Turn Order</Button>
}


const DebugSpecificOptions = () => {
    return (
        <div>
            <RandomizeTurnOrder />
        </div>
    )
}

export default DebugSpecificOptions