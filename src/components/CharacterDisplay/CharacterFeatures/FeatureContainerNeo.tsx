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

const FeatureContainerNeo: FC<FeatureProps> = ({ type, info, flags }) => {
    const EmptyWow = useCallback(() => {
        return <div>Wow, so empty...</div>
    }, [type])

    const SelectedFeature = useCallback(() => {
        if (!type || !(SupportedFeatures.indexOf(type as any) > -1)) {
            return <EmptyWow />
        }
        switch (type) {
            case 'inventory': {
                const { inventory } = info
                return (
                    (inventory && inventory.length > 0 &&
                        inventory.map((item, index) => {
                            return <InfoDisplay key={index} info={item} type={'item'} />
                        })) || <EmptyWow />
                )
            }
            case 'statusEffects': {
                const { status_effects } = info
                return (
                    (status_effects && status_effects.length > 0 &&
                        status_effects.map((effect, index) => {
                            return <InfoDisplay key={index} info={effect} type={'status_effect'} />
                        })) || <EmptyWow />
                )
            }
            case 'spells': {
                const { spellBook } = info
                return (
                    (spellBook && spellBook.length > 0 &&
                        spellBook.map((spell, index) => {
                            return <InfoDisplay key={index} info={spell} type={'spell'} />
                        })) || <EmptyWow />
                )
            }
            case 'weaponry': {
                const { weaponry } = info
                return (
                    (weaponry && weaponry.length > 0 &&
                        weaponry.map((weapon, index) => {
                            return <InfoDisplay key={index} info={weapon} type={'weapon'} />
                        })) || <EmptyWow />
                )
            }
            case 'attributes': {
                const { attributes } = info
                return (
                    (attributes && (
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
                    )) || <EmptyWow />
                )
            }
            default: {
                console.log('Default value was triggered with this:', type)
                return <EmptyWow />
            }
        }
    }, [info, type])

    return (
        <div
            id={`${type}-container`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <>{SelectedFeature ? SelectedFeature() : EmptyWow()}</>
        </div>
    )
}

export default FeatureContainerNeo
