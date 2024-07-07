import Battlefield from '@components/Battlefield/Battlefield'
import CombatEditor from '@components/CombatEditor/CombatEditor'
import { resetGameComponentsStateAction } from '@redux/highActions'
import { selectBattlefieldMold, setBattlefieldMode, setInteractableTiles } from '@redux/slices/battlefieldSlice'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import paths from '@router/paths'
import APIService from '@services/APIService'
import { AxiosError } from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@hooks/useToast'

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
    const dispatch = useDispatch<AppDispatch>()
    const { t } = useTranslation()
    const battlefield = useSelector(selectBattlefieldMold)
    const { toastError } = useToast()

    const lobbyId = useSelector(selectLobbyId)
    const [combatName, setCombatName] = useState('MyNewPreset')
    const [combatPreset, setCombatPreset] = useState({
        field: {
            '4/3': {
                path: 'builtins:hero',
                source: 'dlc',
                controlledBy: {
                    type: 'player',
                    id: '660953204bd5e6d58ed510d2',
                },
            },
            '3/4': {
                path: 'builtins:target_dummy',
                source: 'dlc',
                controlledBy: {
                    type: 'player',
                    id: '660953204bd5e6d58ed510d2',
                },
            },
        },
    } as CombatPreset)

    const onSubmit = useCallback(async () => {
        try {
            const { combat_id } = await APIService.createLobbyCombat(lobbyId, combatName, combatPreset)
            dispatch(setBattlefieldMode('info'))
            dispatch(resetGameComponentsStateAction())
            navigate(paths.gameRoom.replace(':lobbyId', lobbyId).replace(':gameId', combat_id))
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error(e.response?.data)
                toastError({ title: t('local:error'), description: e.response?.data.message })
            } else {
                console.error(e)
            }
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
        dispatch(
            setInteractableTiles(
                (() => {
                    const interactableTiles: { [key: string]: boolean } = {}
                    for (let i = 0; i < battlefield.field.length; i++) {
                        for (let j = 0; j < battlefield.field[i].length; j++) {
                            interactableTiles[`${i + 1}/${j + 1}`] = false
                        }
                    }
                    return interactableTiles
                })()
            )
        )
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
