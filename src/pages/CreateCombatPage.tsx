import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Battlefield from '../components/Battlefield/Battlefield'
import CombatEditor from '../components/CombatEditor/CombatEditor'
import { setBattlefieldMode } from '../redux/slices/battlefieldSlice'
import { selectLobbyId } from '../redux/slices/lobbySlice'
import paths from '../router/paths'
import APIService from '../services/APIService'
import { AxiosError } from 'axios'
import {setNotify} from "../redux/slices/notifySlice";

interface CombatPreset {
    field: {
        [square: string]: {
            path: string
            source: string
            controlledBy: {
                type: string
                id: string
            }
        }
    }
}

const CreateCombatPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const lobbyId = useSelector(selectLobbyId)
    const [combatName, setCombatName] = useState('')
    const [combatPreset, setCombatPreset] = useState({
        field: {},
    } as CombatPreset)

    const onSubmit = useCallback(async () => {
        try {
            console.log('Creating combat', combatName, combatPreset)
            dispatch(setBattlefieldMode('info'))
            const { combat_id } = await APIService.createLobbyCombat(lobbyId, combatName, combatPreset)
            navigate(paths.gameRoom.replace(':lobbyId', lobbyId).replace(':gameId', combat_id))
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e.response?.data)
                dispatch(setNotify({
                    message: e.response?.data,
                    code: e.response?.status || 400
                }))
            } else {
                console.error(e)
            }
            // navigate(paths.lobbyRoom.replace(':lobbyId', lobbyId))
        }
    }, [combatName, combatPreset, navigate])

    const addCharacter = (
        square: string,
        controlledBy: {
            type: string
            id: string
        },
        path: string,
        source: string
    ) => {
        setCombatPreset({
            field: {
                ...combatPreset.field,
                [square]: {
                    path,
                    source,
                    controlledBy,
                },
            },
        })
    }

    useEffect(() => {
        dispatch(setBattlefieldMode('selection'))
    }, [])

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                }}
            >
                <Battlefield />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <h1>Create Combat</h1>
                    <input
                        type="text"
                        value={combatName}
                        placeholder="Enter combat name"
                        onChange={(e) => {
                            setCombatName(e.target.value)
                        }}
                        style={{
                            width: '15vw',
                        }}
                    />
                    <CombatEditor addCharacter={addCharacter} />
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onSubmit().then()
                        }}
                        style={{
                            minWidth: 'fit-content',
                            width: '5vw',
                        }}
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateCombatPage
