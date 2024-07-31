import { EntityInfoFull } from '@models/Battlefield'
import CharacterDisplay, { CharacterDisplaySettings } from '@components/CharacterDisplay/CharacterDisplay'
import CharacterDisplayPlaceholder from "@components/CharacterDisplay/CharacterDisplayPlaceholder"

const InGameSettings: CharacterDisplaySettings = {
    includeDescription: false,
    showEquippedWeapon: true,
    showSquareIfPossible: true,
    ignoreAttributes: [
        'builtins:current_health',
        'builtins:max_health',
        'builtins:current_action_points',
        'builtins:max_action_points',
        'builtins:current_armor',
        'builtins:base_armor',
    ],
    displayBasicAttributes: true
}
const InLobbySettings: CharacterDisplaySettings = {
    includeDescription: true,
    showEquippedWeapon: false,
    showSquareIfPossible: false,
    ignoreAttributes: [
        'builtins:current_health',
        'builtins:current_action_points',
        'builtins:current_armor',
    ],
    displayBasicAttributes: false
}

const CharacterDisplayInGame = ({ character }: {character: EntityInfoFull}) => (
    <CharacterDisplay character={character} settings={InGameSettings} />
)
const CharacterDisplayInLobby = ({ character }: {character: EntityInfoFull}) => (
    <CharacterDisplay character={character} settings={InLobbySettings} />
)

export { CharacterDisplayInGame, CharacterDisplayInLobby, CharacterDisplay, CharacterDisplayPlaceholder }
