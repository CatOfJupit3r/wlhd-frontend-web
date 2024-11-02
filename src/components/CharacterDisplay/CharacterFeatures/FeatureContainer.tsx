import AttributeDisplay from '@components/CharacterDisplay/CharacterFeatures/AttributeDisplay'
import {
    ItemInfoDisplay,
    SpellInfoDisplay,
    StatusEffectInfoDisplay,
    WeaponInfoDisplay,
} from '@components/InfoDisplay/InfoDisplay'
import { EmptyMenuContent } from '@components/ui/menu'
import { EntityInfoFull } from '@models/GameModels'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import ComponentMemoriesDisplay from '@components/InfoDisplay/ComponentMemoriesDisplay'
import TagsDisplay from '@components/InfoDisplay/TagsDisplay'
import { Separator } from '@components/ui/separator'

const SupportedFeatures = ['inventory', 'statusEffects', 'spells', 'weaponry', 'attributes', 'misc'] as const

type FeatureProps = {
    type: (typeof SupportedFeatures)[number] | string
    info: EntityInfoFull
    flags: {
        ignoreAttributes?: Array<string>
    }
}

const FeatureContainerContent: FC<FeatureProps> = ({ type, info, flags }) => {
    const { t } = useTranslation('local', {
        keyPrefix: 'game.character-display',
    })
    if (!type || !(SupportedFeatures.indexOf(type as never) > -1)) {
        return <EmptyMenuContent />
    }

    switch (type) {
        case 'inventory': {
            const { inventory } = info
            if (inventory && inventory.length > 0) {
                return (
                    <>
                        {inventory.map((item, index) => {
                            return <ItemInfoDisplay key={index} info={item} />
                        })}
                    </>
                )
            }
            break
        }
        case 'statusEffects': {
            const { statusEffects } = info
            if (statusEffects && statusEffects.length > 0) {
                return (
                    <>
                        {statusEffects.map((effect, index) => {
                            return <StatusEffectInfoDisplay key={index} info={effect} />
                        })}
                    </>
                )
            }
            break
        }
        case 'spells': {
            const spellBook = info.spellBook
            if (spellBook && spellBook.knownSpells.length > 0) {
                return (
                    <>
                        {spellBook.knownSpells.map((spell, index) => {
                            return <SpellInfoDisplay key={index} info={spell} />
                        })}
                    </>
                )
            }
            break
        }
        case 'weaponry': {
            const { weaponry } = info
            if (weaponry && weaponry.length > 0) {
                return (
                    <>
                        {weaponry.map((weapon, index) => {
                            return <WeaponInfoDisplay key={index} info={weapon} />
                        })}
                    </>
                )
            }
            break
        }
        case 'attributes': {
            const { attributes } = info
            if (attributes) {
                return <AttributeDisplay attributes={attributes} ignore={flags?.ignoreAttributes || []} />
            }
            break
        }
        case 'misc': {
            if (info.memory && info.tags) {
                return (
                    <div className={'flex w-full flex-col gap-1'}>
                        <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                            <p className={'text-center text-t-normal'}>{t('misc.memories-title')}</p>
                            <ComponentMemoriesDisplay memories={info.memory} />
                        </div>
                        <Separator/>
                        <div className={'flex w-full flex-col justify-center gap-1 p-4'}>
                            <p className={'text-center text-t-normal'}>{t('misc.tags-title')}</p>
                            <TagsDisplay tags={info.tags} />
                        </div>
                    </div>
                )
            }
            break
        }
        default: {
            console.log('Default value was triggered with this:', type)
            break
        }
    }

    return <EmptyMenuContent />
}

const FeatureContainer = ({ type, info, flags }: FeatureProps) => {
    return (
        <div id={`${type}-container`} className={'flex flex-col gap-4'}>
            <FeatureContainerContent type={type} info={info} flags={flags} />
        </div>
    )
}

export default FeatureContainer
