import { EntityInfoFull } from '@models/Battlefield'
import CharacterDisplay, { CharacterDisplaySettings } from '@components/CharacterDisplay/CharacterDisplay'
import CharacterDisplayPlaceholder from "@components/CharacterDisplay/CharacterDisplayPlaceholder"

const InGameSettings: CharacterDisplaySettings = {
    includeDescription: false,
    showEquippedWeapon: true,
    showSquareIfPossible: true,
    attributeShowFlags: {
        ap: true,
        armor: true,
        health: true,
    },
}
const InLobbySettings: CharacterDisplaySettings = {
    includeDescription: true,
    showEquippedWeapon: false,
    showSquareIfPossible: false,
}

const CharacterDisplayInGame = ({ character }: {character: EntityInfoFull}) => (
    <CharacterDisplay character={character} settings={InGameSettings} />
)
const CharacterDisplayInLobby = ({ character }: {character: EntityInfoFull}) => (
    <CharacterDisplay character={character} settings={InLobbySettings} />
)

export { CharacterDisplayInGame, CharacterDisplayInLobby, CharacterDisplay, CharacterDisplayPlaceholder }
