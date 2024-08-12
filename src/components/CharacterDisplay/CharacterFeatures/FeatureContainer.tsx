import React, { FC, useCallback } from 'react'
import { EntityInfoFull } from '@models/Battlefield'
import {
    ItemInfoDisplay,
    SpellInfoDisplay,
    StatusEffectInfoDisplay,
    WeaponInfoDisplay,
} from '@components/InfoDisplay/InfoDisplay'
import AttributeDisplay from '@components/CharacterDisplay/CharacterFeatures/AttributeDisplay'
import { EmptyMenuContent } from '@components/ui/menu'

const SupportedFeatures = ['inventory', 'statusEffects', 'spells', 'weaponry', 'attributes'] as const

type FeatureProps = {
    type: (typeof SupportedFeatures)[number] | string
    info: EntityInfoFull
    flags: {
        ignoreAttributes?: Array<string>
    }
}

const FeatureContainer: FC<FeatureProps> = ({ type, info, flags }) => {
    const SelectedFeature = useCallback(() => {
        if (!type || !(SupportedFeatures.indexOf(type as any) > -1)) {
            return <EmptyMenuContent />
        }
        const children: Array<JSX.Element> = []
        switch (type) {
            case 'inventory': {
                const { inventory } = info
                inventory &&
                    inventory.length > 0 &&
                    children.push(
                        ...(inventory && inventory.length > 0
                            ? inventory.map((item, index) => {
                                  return <ItemInfoDisplay key={index} info={item} />
                              })
                            : [])
                    )
                break
            }
            case 'statusEffects': {
                const { statusEffects } = info
                statusEffects &&
                    statusEffects.length > 0 &&
                    children.push(
                        ...(statusEffects && statusEffects.length > 0
                            ? statusEffects.map((effect, index) => {
                                  return <StatusEffectInfoDisplay key={index} info={effect} />
                              })
                            : [])
                    )
                break
            }
            case 'spells': {
                const spellBook = info.spellBook
                spellBook &&
                    spellBook.spells.length > 0 &&
                    children.push(
                        ...(spellBook && spellBook.spells.length > 0
                            ? spellBook.spells.map((spell, index) => {
                                  return <SpellInfoDisplay key={index} info={spell} />
                              })
                            : [])
                    )
                break
            }
            case 'weaponry': {
                const { weaponry } = info
                weaponry &&
                    weaponry.length > 0 &&
                    children.push(
                        ...(weaponry && weaponry.length > 0
                            ? weaponry.map((weapon, index) => {
                                  return <WeaponInfoDisplay key={index} info={weapon} />
                              })
                            : [])
                    )
                break
            }
            case 'attributes': {
                const { attributes } = info
                attributes &&
                    children.push(
                        <AttributeDisplay
                            attributes={info.attributes}
                            ignore={flags?.ignoreAttributes || []}
                            key={'attributes'}
                        />
                    )
                break
            }
            default: {
                console.log('Default value was triggered with this:', type)
                break
            }
        }
        return children && children.length > 0 ? children : <EmptyMenuContent />
    }, [info, type])

    return (
        <div id={`${type}-container`} className={'flex flex-col gap-4'}>
            <>{SelectedFeature ? SelectedFeature() : EmptyMenuContent()}</>
        </div>
    )
}

export default FeatureContainer
