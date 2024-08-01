import { EntityInfoFull } from '@models/Battlefield'
import CharacterFeatures from '@components/CharacterDisplay/CharacterFeatures/CharacterFeatures'
import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo'
import BasicCharacterAttributes from '@components/CharacterDisplay/BasicCharacterAttributes'
import { Separator } from '@components/ui/separator'

export interface CharacterDisplaySettings {
    includeDescription?: boolean
    showEquippedWeapon?: boolean
    showSquareIfPossible?: boolean
    ignoreAttributes?: Array<string>
    displayBasicAttributes?: boolean
}

export interface CharacterDisplayProps {
    character: EntityInfoFull
    settings?: CharacterDisplaySettings
}

const CharacterDisplay = ({ character, settings }: CharacterDisplayProps) => {
    return (
        <div className={'flex flex-col gap-4 border-2 p-4'}>
            <CharacterBasicInfo
                character={{
                    name: character.decorations.name,
                    description: character.decorations.description || null,
                    sprite: character.decorations.sprite,
                    square: character.square || null,
                }}
                includeSquare={settings?.showSquareIfPossible}
                includeDescription={settings?.includeDescription}
            />
            {(settings?.displayBasicAttributes && <BasicCharacterAttributes attributes={character.attributes} />)}
            {settings?.showEquippedWeapon && (
                <p id={'active-weapon'}>
                    Active weapon:{' '}
                    {character.weaponry
                        .filter((w) => w.isActive)
                        .map((w) => w.decorations.name)
                        .join(', ') || 'None'}
                </p>
            )}
            <Separator />
            <CharacterFeatures
                character={character}
                flags={{
                    ignoreAttributes: settings?.ignoreAttributes,
                }}
            />
        </div>
    )
}

export default CharacterDisplay
