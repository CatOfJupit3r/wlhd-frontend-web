import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CharacterInfo } from '../models/CharacterInfo'
import APIService from '../services/APIService'
import { useSelector } from 'react-redux'
import { selectLobbyInfo } from '../redux/slices/lobbySlice'

const ViewCharacterPage = () => {
    // try get query from url. If not found, then we will get character for current player. If found, then we will get character with id from query
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    const lobbyInfo = useSelector(selectLobbyInfo)

    // get character id from query
    const characterId = searchParams.get('id')
    const path = window.location.pathname.split('/')

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
            let response
            if (characterId && lobbyInfo) {
                response = await APIService.getCharacterInfo(characterId, lobbyInfo.lobbyId)
            } else {
                if (!lobbyInfo.lobbyId) {
                    navigate('..')
                } else {
                    response = await APIService.getMyCharacterInfo(lobbyInfo.lobbyId)
                }
            }
            console.log('Entity info:', response)
            if (response) {
                console.log('Setting entity info')
                setCharacterInfo(response)
            } else {
                navigate('..')
            }
        } catch (error) {
            console.log(error)
            navigate('..')
        }
    }, [characterId])

    useEffect(() => {
        refreshEntityInfo().then()
    }, [characterId, lobbyInfo.lobbyId])

    return (
        <div>
            <h1>View Character Page</h1>
            {characterInfo && <>
                <h2>{characterInfo.descriptor}</h2>
            </>}
            {
                characterInfo.spellBook && characterInfo.spellBook.length > 0 ? (
                    <div>
                        <h3>Spell Book</h3>
                        <select>
                            {
                                characterInfo.spellBook.map((spell, index) => {
                                    return <option key={index}>{spell.descriptor}</option>
                                })
                            }
                        </select>
                    </div>
                ) : <h3>No spells</h3>
            }
            {
                characterInfo.spellLayout && characterInfo.spellLayout.length > 0 ? (
                    <div>
                        <h3>Spell Layout</h3>
                        {
                            characterInfo.spellLayout.map((spell, index) => {
                                return (
                                    <>
                                        <p key={index}>{spell}</p>
                                        <br/>
                                    </>
                                )
                            })
                        }
                    </div>
                ) : <h3>No layout</h3>
            }
            {
                characterInfo.inventory && characterInfo.inventory.length > 0 ? (
                    <div>
                        <h3>Inventory</h3>
                        <select>
                            {
                                characterInfo.inventory.map((item, index) => {
                                    return <option key={index}>{item.descriptor}</option>
                                })
                            }
                        </select>
                    </div>
                ) : <h3>No items</h3>
            }
            {
                characterInfo.weaponry && characterInfo.weaponry.length > 0 ? (
                    <div>
                        <h3>Weaponry</h3>
                        <select>
                            {
                                characterInfo.weaponry.map((weapon, index) => {
                                    return <option key={index}>{weapon.descriptor}</option>
                                })
                            }
                        </select>
                    </div>
                ) : <h3>No weapons</h3>
            }
        </div>
    )
}

export default ViewCharacterPage
