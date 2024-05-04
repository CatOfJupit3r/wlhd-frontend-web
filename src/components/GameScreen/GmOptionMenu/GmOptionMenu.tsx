import React from 'react'


/*

This component is a special tool for GM to interact with game engine via special commands.
Uses APIService very heavily, as it is the only way to interact with game engine.

Normally, this component is not visible to players.
However, if the mistake is made, it is not a big deal, as game-controller will check if the player is GM and will block unauthorized requests.


For now will leave as a placeholder, as this will require quite a work to implement.

Ideally, GMOptionMenu will not be just "click to request".
I will make it possible to enter parameters (e.g. entity to summon, damage to deal to entity on square, etc.)

Maybe a form?...

*/


const GmOptionMenu = () => {
    // const dispatch = useDispatch()
    // const { t } = useTranslation()

    // const gmOptions = [
    //     {
    //
    //     }
    // ]

    return (
        <div>
            <h1>GM Option Menu</h1>
        </div>
    )
}

export default GmOptionMenu