import React, { useCallback, useState } from 'react'
import APIService from '../services/APIService'
import { useNavigate } from 'react-router-dom'
import paths from '../router/paths'
import Battlefield from '../components/Battlefield/Battlefield'
import { useDispatch, useSelector } from 'react-redux'
import { setBattlefieldMode } from '../redux/slices/battlefieldSlice'
import { selectLobbyId } from '../redux/slices/lobbySlice'

const CreateCombatPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const lobbyId = useSelector(selectLobbyId)
    const [combatName, setCombatName] = useState('')
    const [combatPreset, setCombatPreset] = useState('')

    const onSubmit = useCallback(async () => {
        console.log('Creating combat', combatName, combatPreset)
        dispatch(setBattlefieldMode('info'))
        await APIService.createLobbyCombat(lobbyId, combatName, combatPreset)
        navigate(paths.lobbyRoom.replace(':lobbyId', lobbyId))
    }, [combatName, combatPreset, navigate])

    return (
        <div>
            <h1>Create Combat</h1>
            <form>
                <input
                    type="text"
                    value={combatName}
                    placeholder="Enter combat name"
                    onChange={(e) => {
                        setCombatName(e.target.value)
                    }}
                />
            </form>
            <Battlefield />
            <button onClick={(e) => {
                e.preventDefault()
                onSubmit().then()
            } }>Create</button>
        </div>
    )
}

export default CreateCombatPage