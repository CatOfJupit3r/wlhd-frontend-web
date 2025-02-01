import DebugSpecificOptions from '@components/GameScreen/GmOptionMenu/DebugSpecificOptions';

/*

This component is a special tool for GM to interact with game engine via special commands.
Uses APIService very heavily, as it is the only way to interact with game engine.

Normally, this component is not visible to players.
However, if the mistake is made, it is not a big deal, as game-controller will check if the player is GM and will block unauthorized requests.


For now will leave as a placeholder, as this will require quite a work to implement.

Ideally, GMOptionMenu will not be just "click to request".
I will make it possible to enter parameters (e.g. character to summon, damage to deal to character on square, etc.)

Maybe a form?...

*/

const GmOptionMenu = () => {
    return (
        <div className={'flex flex-col gap-3 px-3'}>
            <DebugSpecificOptions />
        </div>
    );
};

export default GmOptionMenu;
