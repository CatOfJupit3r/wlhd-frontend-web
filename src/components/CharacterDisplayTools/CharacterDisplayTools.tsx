import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CharacterInfo } from '../../models/CharacterInfo'
import { selectLobbyInfo } from '../../redux/slices/lobbySlice'
import APIService from '../../services/APIService'
import CharacterDisplayContent from './CharacterDisplayContent/CharacterDisplayContent'
import styles from './CharacterDisplayTools.module.css'

const CharacterDisplayTools = ({ initialCharacter }: { initialCharacter: string }) => {
    const { lobbyId, players } = useSelector(selectLobbyInfo)

    const [currentCharacter, setCurrentCharacter] = useState(initialCharacter || '')

    const [characterInfo, setCharacterInfo] = useState({
        descriptor: '',
        decorations: {
            name: '',
            description: '',
            sprite: '',
        },
        controlledBy: [],
        attributes: {},
        spellBook: [],
        spellLayout: [],
        inventory: [],
        weaponry: [],
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

    const refreshEntityInfo = useCallback(async () => {
        try {
            if (!currentCharacter || !lobbyId) {
                return
            }
            const entityInfo = await APIService.getCharacterInfo(currentCharacter, lobbyId)
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