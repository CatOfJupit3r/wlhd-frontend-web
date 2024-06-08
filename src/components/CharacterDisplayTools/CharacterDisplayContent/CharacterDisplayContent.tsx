import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CharacterInfo } from '../../../models/CharacterInfo'
import { selectLobbyInfo } from '../../../redux/slices/lobbySlice'
import { generateAssetPath } from '../../Battlefield/utils'
import CharacterFeatures from '../CharacterFeatures/CharacterFeatures'
import { SiUps } from "react-icons/si";
import styles from './CharacterDisplayContent.module.css'

const CharacterDisplayContent = ({
    characterInfo,
    setCurrentCharacter,
}: {
    characterInfo: CharacterInfo
    setCurrentCharacter: (descriptor: string) => void
}) => {
    const [{ descriptor, controlledBy, decorations, level, gold }, setInfo] = useState(characterInfo)
    const { characters } = useSelector(selectLobbyInfo)

    useEffect(() => {
        setInfo(characterInfo)
    }, [characterInfo])

    const MainSection = useCallback(() => {
        return (
            <div
                className={styles.mainSection}
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                }}
            >
                <img
                    src={generateAssetPath('coordinator', decorations.sprite)}
                    alt={'character-sprite'}
                    onError={(e) => {
                        if (e.currentTarget.src == '/assets/local/invalid_asset.png') {
                            return
                        }
                        e.currentTarget.src = '/assets/local/invalid_asset.png'
                    }}
                    style={{
                        width: '5rem',
                        height: '5rem',
                        minWidth: '5rem',
                        minHeight: '5rem',
                        borderRadius: '1.25rem',
                        border: '1px solid black',
                    }}
                />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        padding: '1rem',
                        paddingTop: '0',
                        gap: '0.25rem',
                    }}
                >
                    <select
                        value={descriptor}
                        onChange={(e) => {
                            setCurrentCharacter(e.target.value)
                        }}
                    >
                        {characters.map((char) => (
                            <option key={char.descriptor} value={char.descriptor}>
                                {char.name} (@{char.descriptor})
                            </option>
                        ))}
                    </select>
                    <p>{controlledBy ? controlledBy.join(', ') : 'Not controlled!'}</p>
                </div>
            </div>
        )
    }, [descriptor, controlledBy])

    const LevelGold = useCallback(() => {
        return (
            <div className={styles.levelGoldContainer}>
                <p>Level: {level && level.current || '-'}
                    {level && level.max && level.max > level.current && <SiUps />}
                </p>
                <p>Gold: {gold || 0}</p>
            </div>
        )
    }, [decorations])

    const Description = useCallback(() => {
        return (
            <div className={styles.descriptionContainer}>
                <p>{characters.find((char) => char.descriptor === descriptor)?.description || 'Wow, so empty!..'}</p>
            </div>
        )
    }, [descriptor])

    return (
        <div className={styles.creationToolsContainer}>
            <div
                id={'left-section'}
                style={{
                    height: '100%',
                    width: '40%',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    flexDirection: 'column',
                }}
                className={'border-container-biggest'}
            >
                <MainSection />
                <LevelGold />
                <Description />
            </div>
            <CharacterFeatures />
        </div>
    )
}

export default CharacterDisplayContent
