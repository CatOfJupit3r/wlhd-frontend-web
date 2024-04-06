import React, { useCallback, useState } from 'react'
import APIService from '../services/APIService'
import { useNavigate } from 'react-router-dom'
import paths from '../router/paths'

const CreateCombatPage = () => {
    const navigate = useNavigate()

    const [combatName, setCombatName] = useState('')
    const [combatPreset, setCombatPreset] = useState('')

    const onSubmit = useCallback(async () => {
        console.log('Creating combat', combatName, combatPreset)
        console.log(window.location.pathname.split('/'))
        const lobbyId = (() => {
            const paths = window.location.pathname.split('/')
            return paths[paths.length - 2]
        })()
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
                <input
                    type="text"
                    value={combatPreset}
                    placeholder="Enter combat preset"
                    onChange={(e) => {
                        setCombatPreset(e.target.value)
                    }}
                />
                <button onClick={(e) => {
                    e.preventDefault()
                    onSubmit().then()
                } }>Create</button>
            </form>
        </div>
    )
}

export default CreateCombatPage