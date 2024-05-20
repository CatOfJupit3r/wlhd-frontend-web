import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { highlightOnlyThisSquare, selectClickedSquare } from '../../redux/slices/battlefieldSlice'
import { selectLobbyInfo } from '../../redux/slices/lobbySlice'

const CombatEditor = ({
    addCharacter,
}: {
    addCharacter: (
        square: string,
        controlledBy: {
            type: string
            id: string
        },
        path: string,
        source: string
    ) => void
}) => {
    const dispatch = useDispatch()

    const [entityInformation, setEntityInformation] = useState({
        source: 'dlc',
        path: '',
        controlled_by: {
            type: 'player',
            id: '',
        },
    })

    const currentSquare = useSelector(selectClickedSquare)
    const lobbyInfo = useSelector(selectLobbyInfo)

    useEffect(() => {
        // TODO: Add `highlightMode` to battlefieldSlice. `sequential` | `individual`. to avoid 3 redux actions at once.
        if (currentSquare) dispatch(highlightOnlyThisSquare(currentSquare))
        setEntityInformation({
            source: 'dlc',
            path: '',
            controlled_by: {
                type: 'player',
                id: '',
            },
        })
    }, [currentSquare])

    const PlayerEnter = useCallback(() => {
        return (
            <>
                <select
                    onChange={(e) =>
                        setEntityInformation({
                            ...entityInformation,
                            controlled_by: {
                                ...entityInformation.controlled_by,
                                id: e.target.value,
                            },
                        })
                    }
                    value={entityInformation.controlled_by.id || 'none'}
                >
                    <option value={'none'} disabled>
                        Choose player
                    </option>
                    {lobbyInfo.players.map((player) => (
                        <option key={player.userId} value={player.userId}>
                            {player.nickname}
                        </option>
                    ))}
                </select>
            </>
        )
    }, [entityInformation])

    const AIEnter = useCallback(() => {
        return (
            <input
                type="text"
                placeholder="Behavior ID"
                onChange={(e) =>
                    setEntityInformation({
                        ...entityInformation,
                        controlled_by: { ...entityInformation.controlled_by, id: e.target.value },
                    })
                }
                value={entityInformation.controlled_by.id}
            />
        )
    }, [entityInformation])

    const DisplayControlEnters = useCallback(() => {
        switch (entityInformation.controlled_by.type) {
            case 'player':
                return PlayerEnter()
            case 'ai':
                return AIEnter()
            default:
                return null
        }
    }, [entityInformation])

    const AIOrPlayerSelection = useCallback(() => {
        return (
            <>
                <select
                    onChange={(e) =>
                        setEntityInformation({
                            ...entityInformation,
                            controlled_by: { ...entityInformation.controlled_by, type: e.target.value },
                        })
                    }
                    value={entityInformation.controlled_by.type}
                >
                    <option value={'none'} disabled>
                        Choose type
                    </option>
                    <option value={'player'}>Player</option>
                    <option value={'ai'}>AI</option>
                    <option value={'game_logic'}>Game logic</option>
                </select>
            </>
        )
    }, [entityInformation])

    const inputsForEmbeddedCharacter = useCallback(() => {
        return (
            <>
                <select
                    onChange={(e) => setEntityInformation({ ...entityInformation, path: e.target.value })}
                    value={entityInformation.path}
                >
                    <option disabled value={''}>
                        Choose character
                    </option>
                    {lobbyInfo.players.map((player) => (
                        <option key={player.userId} value={player.userId}>
                            {player.mainCharacter}
                        </option>
                    ))}
                </select>
            </>
        )
    }, [entityInformation, lobbyInfo])

    const inputsForDLCCharacter = useCallback(() => {
        return (
            <>
                <input
                    type="text"
                    placeholder="Descriptor"
                    onChange={(e) => setEntityInformation({ ...entityInformation, path: e.target.value })}
                    value={entityInformation.path}
                />
            </>
        )
    }, [entityInformation])

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
            }}
        >
            <h2>Current square: {currentSquare}</h2>
            <form
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <select
                    onChange={(e) => setEntityInformation({ ...entityInformation, source: e.target.value })}
                    value={entityInformation.source}
                >
                    <option value={'none'} disabled>
                        Creature source
                    </option>
                    <option value={'dlc'}>DLC</option>
                    <option value={'embedded'}>Embedded</option>
                </select>
                {entityInformation.source === 'dlc' ? inputsForDLCCharacter() : inputsForEmbeddedCharacter()}
                {AIOrPlayerSelection()}
                {DisplayControlEnters()}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        if (!currentSquare) return
                        addCharacter(
                            currentSquare,
                            entityInformation.controlled_by,
                            entityInformation.path,
                            entityInformation.source
                        )
                    }}
                >
                    Add character
                </button>
            </form>
        </div>
    )
}

export default CombatEditor
