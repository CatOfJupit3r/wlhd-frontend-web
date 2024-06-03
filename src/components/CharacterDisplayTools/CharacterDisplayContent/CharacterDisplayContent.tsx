import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CharacterInfo } from '../../../models/CharacterInfo'
import { selectLobbyInfo } from '../../../redux/slices/lobbySlice'
import styles from './CharacterDisplayContent.module.css'
import CharacterFeatures from '../CharacterFeatures/CharacterFeatures'

const CharacterDisplayContent = ({
    characterInfo,
    setCurrentCharacter,
}: {
    characterInfo: CharacterInfo
    setCurrentCharacter: (descriptor: string) => void
}) => {
    const [{ descriptor, controlledBy, attributes, spellBook, spellLayout, inventory, weaponry }, setInfo] =
        useState(characterInfo)
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
                    src={'https://placehold.co/500x500'}
                    alt={'character-sprite'}
                    style={{
                        width: '5rem',
                        height: '5rem',
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
                    border: '0.125rem solid black',
                    borderRadius: '1.25rem',
                    borderBottom: '0.25rem solid black',
                    padding: '1rem',
                    display: 'flex',
                    gap: '1rem',
                    flexDirection: 'column',
                }}
            >
                <MainSection />
                <Description />
            </div>
            <CharacterFeatures
                attributes={attributes}
                spellBook={spellBook}
                spellLayout={spellLayout}
                inventory={inventory}
                weaponry={weaponry}
            />
        </div>
    )
}

export default CharacterDisplayContent
