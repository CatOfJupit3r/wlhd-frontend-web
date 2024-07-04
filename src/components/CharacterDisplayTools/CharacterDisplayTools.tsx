import { CharacterInfo } from '@models/CharacterInfo'
import { setDescriptor } from '@redux/slices/characterSlice'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import APIService from '@services/APIService'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CharacterDisplayContent from './CharacterDisplayContent/CharacterDisplayContent'
import styles from './CharacterDisplayTools.module.css'

const CharacterDisplayTools = ({ initialCharacter }: { initialCharacter: string }) => {
    const { lobbyId, players } = useSelector(selectLobbyInfo)
    const dispatch = useDispatch<AppDispatch>()

    const [currentCharacter, setCurrentCharacter] = useState(initialCharacter || '')

    const [characterInfo, setCharacterInfo] = useState({
        descriptor: '',
        decorations: {
            name: '',
            description: '',
            sprite: '',
        },
        controlledBy: [],
        level: {
            current: 0,
            max: 0,
        },
        gold: 0,
    } as CharacterInfo)

    const setControllingPlayers = useCallback(() => {
        const player = players.filter((player) =>
            player.characters.some((char) => char.descriptor === currentCharacter)
        )
        if (player) {
            setCharacterInfo((prev) => ({
                ...prev,
                controlledBy: player.map((p) => `${p.player.nickname} (@${p.player.handle})`),
            }))
        }
    }, [currentCharacter, players])

    useEffect(() => {
        if (!currentCharacter) {
            return
        }
        dispatch(setDescriptor(currentCharacter))
    }, [currentCharacter])

    const refreshEntityInfo = useCallback(async () => {
        try {
            if (!currentCharacter || !lobbyId) {
                return
            }
            const entityInfo = await APIService.getBasicCharacterInfo(lobbyId, currentCharacter)
            setCharacterInfo(entityInfo)
            setControllingPlayers()
        } catch (error) {
            console.log(error)
        }
    }, [currentCharacter, lobbyId])

    useEffect(() => {
        refreshEntityInfo().then()
    }, [currentCharacter, lobbyId])

    return (
        <div className={styles.crutch}>
            <CharacterDisplayContent
                characterInfo={characterInfo}
                setCurrentCharacter={(descriptor: string) => {
                    setCurrentCharacter(descriptor)
                }}
            />
        </div>
    )
}

export default CharacterDisplayTools
