import CharacterDisplay, {
    CharacterDisplayProps,
    CharacterDisplaySettings,
} from '@components/CharacterDisplay/CharacterDisplay';
import CharacterDisplayPlaceholder from '@components/CharacterDisplay/CharacterDisplayPlaceholder';

const InGameSettings: CharacterDisplaySettings = {
    includeDescription: true,
    showEquippedWeapon: true,
    showSquareIfPossible: true,
    displayBasicInfo: true,
    ignoreAttributes: [
        'builtins:current_health',
        'builtins:max_health',
        'builtins:current_action_points',
        'builtins:max_action_points',
        'builtins:current_armor',
        'builtins:base_armor',
    ],
    displayBasicAttributes: true,
};
const InLobbySettings: CharacterDisplaySettings = {
    includeDescription: true,
    showEquippedWeapon: false,
    showSquareIfPossible: false,
    displayBasicInfo: true,
    ignoreAttributes: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    displayBasicAttributes: true,
    ignoreCurrentValuesInBasicAttributes: true,
};

const GameWikiSettings: CharacterDisplaySettings = {
    includeDescription: true,
    showEquippedWeapon: false,
    showSquareIfPossible: false,
    displayBasicInfo: false,
    ignoreAttributes: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    displayBasicAttributes: true,
    ignoreCurrentValuesInBasicAttributes: true,
};

type displayWithoutSettings = Omit<CharacterDisplayProps, 'settings'>;

const CharacterDisplayInGame = (props: displayWithoutSettings) => (
    <CharacterDisplay {...props} settings={InGameSettings} />
);

const CharacterDisplayInLobby = (props: displayWithoutSettings) => (
    <CharacterDisplay {...props} settings={InLobbySettings} />
);

export {
    CharacterDisplayInGame,
    CharacterDisplayInLobby,
    CharacterDisplay,
    CharacterDisplayPlaceholder,
    GameWikiSettings,
};
