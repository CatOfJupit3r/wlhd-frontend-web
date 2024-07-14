import { generateAssetPath } from '@components/Battlefield/utils'
import GameAsset from '@components/GameAsset'
import { CharacterInfo } from '@models/CharacterInfo'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { useCallback, useEffect, useState } from 'react'
import { SiUps } from 'react-icons/si'
import { useSelector } from 'react-redux'
import CharacterFeatures from '../CharacterFeatures/CharacterFeatures'
import styles from './CharacterDisplayContent.module.css'
import { cn } from '@lib/utils'

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
            <div className={'flex w-full flex-row'}>
                <GameAsset
                    src={generateAssetPath('coordinator', decorations.sprite)}
                    alt={'character-sprite'}
                    style={{
                        borderRadius: '1.25rem',
                        border: '1px solid black',
                    }}
                    className={'size-20 min-h-20 min-w-20'}
                />
                <div className={'flex size-full flex-col gap-1 p-4 pt-0'}>
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
                <p>
                    Level: {(level && level.current) || '-'}
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
                className={cn(
                    'border-container-biggest',
                    'h-full w-[40%] p-4 flex gap-4 flex-col w-max-[1028px]:w-full'
                )}
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
