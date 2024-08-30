import BasicCharacterAttributes from '@components/CharacterDisplay/BasicCharacterAttributes'
import CharacterBasicInfo from '@components/CharacterDisplay/CharacterBasicInfo'
import CharacterFeatures from '@components/CharacterDisplay/CharacterFeatures/CharacterFeatures'
import { Separator } from '@components/ui/separator'
import { EntityInfoFull } from '@models/Battlefield'
import { HTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

export interface CharacterDisplaySettings {
    includeDescription?: boolean
    showEquippedWeapon?: boolean
    showSquareIfPossible?: boolean
    ignoreAttributes?: Array<string>
    displayBasicAttributes?: boolean
    ignoreCurrentValuesInBasicAttributes?: boolean
}

export type CharacterDisplayProps = {
    character: EntityInfoFull
    settings?: CharacterDisplaySettings
} & HTMLAttributes<HTMLDivElement>

const EquippedWeapon = ({
    weapons,
    ...props
}: {
    weapons: EntityInfoFull['weaponry']
} & HTMLAttributes<HTMLDivElement>) => {
    const { t } = useTranslation()

    if (weapons.length === 0) {
        return <p {...props}>{t('local:game.character_display.no_active_weapon')}</p>
    }

    return (
        <p {...props}>
            {t('local:game.character_display.active_weapon', {
                weapon: weapons.map((w) => t(w.decorations.name)).join(', ') || '...',
            })}
        </p>
    )
}

const CharacterDisplay = ({ character, settings, ...props }: CharacterDisplayProps) => {
    return (
        <div {...props}>
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
            {settings?.displayBasicAttributes && (
                <BasicCharacterAttributes
                    attributes={character.attributes}
                    flags={{
                        ignoreCurrentValues: settings?.ignoreCurrentValuesInBasicAttributes,
                    }}
                />
            )}
            {settings?.showEquippedWeapon && (
                <EquippedWeapon weapons={character.weaponry} className={'text-t-small italic'} id={'active-weapon'} />
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
