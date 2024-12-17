import { CharacterDisplayInGame } from '@components/CharacterDisplay'
import { selectActiveCharacter, selectControlledCharacters } from '@redux/slices/gameScreenSlice'
import { useSelector } from 'react-redux'

const ControlledCharactersInfo = () => {
    const controlledCharacters = useSelector(selectControlledCharacters)
    const activeCharacter = useSelector(selectActiveCharacter)

    return (
        <div className={'flex h-full w-full flex-col gap-3 overflow-y-scroll p-2'}>
            {controlledCharacters ? (
                controlledCharacters.length > 0 ? (
                    controlledCharacters
                        .map((character, index) => (
                            <CharacterDisplayInGame
                                character={character}
                                className={'flex w-full flex-col gap-4 border-2 p-4'}
                                key={index}
                            />
                        ))
                        .sort((a, b) => {
                            if (activeCharacter) {
                                const activeCharacterSquare = JSON.stringify(activeCharacter.square)
                                if (JSON.stringify(b.props.character?.square) === activeCharacterSquare) {
                                    return 1
                                } else if (JSON.stringify(a.props.character?.square) === activeCharacterSquare) {
                                    return -1
                                }
                                return a.props.character?.square?.line > b.props.character?.square?.line ? 1 : -1
                            }
                            return a.props.character?.square?.line > b.props.character?.square?.line ? 1 : -1
                        })
                ) : (
                    <p>You have no characters</p>
                )
            ) : (
                <p>You have no characters</p>
            )}
        </div>
    )
}

export default ControlledCharactersInfo
