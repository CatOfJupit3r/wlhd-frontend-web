import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CharacterInfo } from '../models/CharacterInfo'
import { selectLobbyInfo } from '../redux/slices/lobbySlice'
import APIService from '../services/APIService'

const ViewCharacterPage = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const lobbyInfo = useSelector(selectLobbyInfo)

    const [currentCharacter, setCurrentCharacter] = useState(searchParams.get('id') || '')

    const [characterInfo, setCharacterInfo] = useState({
        descriptor: '',
        controlledBy: '',
        attributes: {},
        spellBook: [],
        spellLayout: [],
        inventory: [],
        weaponry: [],
    } as CharacterInfo)

    const refreshEntityInfo = useCallback(async () => {
        try {
            // let response
            // if (currentCharacter && lobbyInfo) {
            //     response = await APIService.getCharacterInfo(currentCharacter, lobbyInfo.lobbyId)
            // } else {
            //     if (!lobbyInfo.lobbyId) {
            //         navigate('..')
            //     } else {
            //         response = await APIService.getMyCharacterInfo(lobbyInfo.lobbyId)
            //     }
            // }
            // console.log('Entity info:', response)
            // if (response) {
            //     console.log('Setting entity info')
            //     setCharacterInfo(response)
            // }
        } catch (error) {
            console.log(error)
        }
    }, [currentCharacter])

    useEffect(() => {
        refreshEntityInfo().then()
    }, [currentCharacter, lobbyInfo.lobbyId])

    return (
        <div>
            <h1>View Character Page</h1>
            <select
                defaultValue={currentCharacter}
                onChange={(e) => setCurrentCharacter(e.target.value)}
                title={'Choose character'}
            >
                <>
                    <option disabled={true}>Choose player</option>
                    {lobbyInfo.players.map(({player, character}, index) => {
                        return player.nickname ? <option key={index} value={character?.name}>{player.nickname}</option> : null
                    })}
                </>
            </select>
            <button onClick={refreshEntityInfo}>Refresh Character Info</button>
            {characterInfo && (
                <>
                    <h2>{characterInfo.descriptor}</h2>
                </>
            )}
            {
                characterInfo.attributes && (
                    <div>
                        <h3>Attributes</h3>
                        {Object.keys(characterInfo.attributes).map((key, index) => {
                            return characterInfo.attributes[key] !== 'undefined' ? (
                                <p key={index}>
                                    {key}: {characterInfo.attributes[key]}
                                </p>
                            ) : null
                        })}
                    </div>
                )
            }
            {characterInfo.spellBook && characterInfo.spellBook.length > 0 ? (
                <div>
                    <h3>Spell Book</h3>
                    <select>
                        {characterInfo.spellBook.map((spell, index) => {
                            return <option key={index}>{spell.descriptor}</option>
                        })}
                    </select>
                </div>
            ) : (
                <h3>No spells</h3>
            )}
            {characterInfo.spellLayout && characterInfo.spellLayout.length > 0 ? (
                <div>
                    <h3>Spell Layout</h3>
                    {characterInfo.spellLayout.map((spell, index) => {
                        return (
                            <>
                                <p key={index}>{spell}</p>
                                <br />
                            </>
                        )
                    })}
                </div>
            ) : (
                <h3>No layout</h3>
            )}
            {characterInfo.inventory && characterInfo.inventory.length > 0 ? (
                <div>
                    <h3>Inventory</h3>
                    <select>
                        {characterInfo.inventory.map((item, index) => {
                            return <option key={index}>{item.descriptor}</option>
                        })}
                    </select>
                </div>
            ) : (
                <h3>No items</h3>
            )}
            {characterInfo.weaponry && characterInfo.weaponry.length > 0 ? (
                <div>
                    <h3>Weaponry</h3>
                    <select>
                        {characterInfo.weaponry.map((weapon, index) => {
                            return <option key={index}>{weapon.descriptor}</option>
                        })}
                    </select>
                </div>
            ) : (
                <h3>No weapons</h3>
            )}
        </div>
    )
}

export default ViewCharacterPage
