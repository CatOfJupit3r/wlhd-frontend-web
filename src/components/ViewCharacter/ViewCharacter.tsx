import React, { useEffect, useState } from 'react'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useSelector } from 'react-redux'
import ShortCharacterInfo from '@components/ViewCharacter/ShortCharacterInfo'
import { EntityInfoFull } from '@models/Battlefield'
import APIService from '@services/APIService'
import { CharacterDisplay, CharacterDisplayInLobby } from '@components/CharacterDisplay'
import { apprf, cn } from '@lib/utils'

const ViewCharacter = ({ initial }: { initial: null | string }) => {
    /*

    We already have character info in our redux store! We just take it from there and render it as such.

    Scrollable list with short info about characters.

    {
        AVATAR Name (@handle)
        AVATAR Controlled by
    }

    The chosen character bg is darker than other and the component imitates the look of ingame display
    (or I change ingame component and this to be the same question mark?)
     */

    const lobby = useSelector(selectLobbyInfo)
    const [current, setCurrent] = useState<null | number>(null)
    const [character, setCharacter] = useState<EntityInfoFull | null>(null)

    useEffect(() => {
        if (initial && lobby && lobby.characters) {
            setCurrent(lobby.characters.findIndex((c) => c.descriptor === initial))
        }
    }, [initial, lobby])

    useEffect(() => {
        if (current === null) {
            setCharacter(null)
        } else if (lobby && lobby.characters && lobby.characters[current]) {
            APIService.getCharacterInfo(lobby.lobbyId, lobby.characters[current].descriptor).then((res) => {
                setCharacter(res)
            })
        }
    }, [current])

    return (
        <div
            className={cn(
                'flex flex-row',
                apprf('max-[760px]', 'flex-col flex') // does not work?
            )}
        >
            <div>
                {lobby.characters.map((char, i) => (
                    <ShortCharacterInfo
                        key={char.descriptor}
                        character={char}
                        controlledBy={lobby.players
                            .filter((p) => character && p.characters.includes(char.descriptor))
                            .map((p) => p.nickname)}
                        onClick={() => setCurrent(i)}
                    />
                ))}
            </div>
            {character ? <CharacterDisplayInLobby character={character} /> : <div>Choose a character</div>}
        </div>
    )
}

export default ViewCharacter
