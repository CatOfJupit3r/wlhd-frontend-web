import React, { FC, useCallback } from 'react'
import { EntityInfoFull } from '@models/Battlefield'
import InfoDisplay from '@components/CharacterDisplay/CharacterFeatures/InfoDisplay/InfoDisplay'
import AttributeDisplay, { attributeShowFlags } from '@components/CharacterDisplay/CharacterFeatures/AttributeDisplay'

const SupportedFeatures = ['inventory', 'statusEffects', 'spells', 'weaponry', 'attributes'] as const

type FeatureProps = {
    type: (typeof SupportedFeatures)[number] | string
    info: EntityInfoFull
    flags: {
        attributes?: attributeShowFlags
    }
}

const FeatureContainer: FC<FeatureProps> = ({ type, info, flags }) => {
    const EmptyWow = useCallback(() => {
        return <div>Wow, so empty...</div>
    }, [type])

    const SelectedFeature = useCallback(() => {
        if (!type || !(SupportedFeatures.indexOf(type as any) > -1)) {
            return <EmptyWow />
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
                                  return <InfoDisplay key={index} info={item} type={'item'} />
                              })
                            : [])
                    )
                break
            }
            case 'statusEffects': {
                const { status_effects } = info
                status_effects &&
                    status_effects.length > 0 &&
                    children.push(
                        ...(status_effects && status_effects.length > 0
                            ? status_effects.map((effect, index) => {
                                  return <InfoDisplay key={index} info={effect} type={'status_effect'} />
                              })
                            : [])
                    )
                break
            }
            case 'spells': {
                const { spellBook } = info
                spellBook &&
                    spellBook.length > 0 &&
                    children.push(
                        ...(spellBook && spellBook.length > 0
                            ? spellBook.map((spell, index) => {
                                  return <InfoDisplay key={index} info={spell} type={'spell'} />
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
                                  return <InfoDisplay key={index} info={weapon} type={'weapon'} />
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
                            {...(flags?.attributes
                                ? {
                                      flags: flags.attributes,
                                  }
                                : {
                                      flags: {
                                          armor: false,
                                          ap: false,
                                          health: false,
                                      },
                                  })}
                        />
                    )
                break
            }
            default: {
                console.log('Default value was triggered with this:', type)
                break
            }
        }
        return (children && children.length > 0) ? children : <EmptyWow />
    }, [info, type])

    return (
        <div
            id={`${type}-container`}
            className={'flex flex-col gap-4'}
        >
            <>{SelectedFeature ? SelectedFeature() : EmptyWow()}</>
        </div>
    )
}

export default FeatureContainer
