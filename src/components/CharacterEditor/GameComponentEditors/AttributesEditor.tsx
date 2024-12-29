import { Input } from '@components/ui/input'
import { Progress } from '@components/ui/progress'
import { useCharacterEditorContext } from '@context/CharacterEditorProvider'
import { capitalizeFirstLetter, getPercentage } from '@utils'
import {
    extractCurrentMaxBaseAttributes,
    extractDualAttributes,
    FancyAttributeArray,
    PrefixCollection,
} from '@utils/gameDisplayTools'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

type setAttributeFuncType = (attribute: string, value: number) => void

interface iCreateInputHandlerOptions {
    maxVal?: number
    allowNegative?: boolean
}

const createInputHandler = (
    setAttribute: setAttributeFuncType,
    attribute: string,
    options: iCreateInputHandlerOptions = {}
) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setAttribute(attribute, 0)
        }
        const parsedValue = parseInt(e.target.value)
        if (!isNaN(parsedValue) && parsedValue <= 99999) {
            if (!options?.allowNegative) {
                if (parsedValue < 0) {
                    setAttribute(attribute, 0)
                    return
                }
            } else {
                if (parsedValue < -99999) {
                    return
                }
            }
            if (options?.maxVal !== undefined) {
                setAttribute(attribute, Math.min(options.maxVal, parsedValue))
            } else {
                setAttribute(attribute, parsedValue)
            }
        }
    }
}

const FancyAttributesWithBar = ({
    current,
    max,
    color,
    setAttribute,
}: {
    current: string
    max: string
    color: string
    setAttribute: setAttributeFuncType
}) => {
    const { character } = useCharacterEditorContext()
    const { t } = useTranslation()
    const percentage = getPercentage(character.attributes[current], character.attributes[max])

    return (
        <div className={'flex flex-col gap-3 py-2 text-base'}>
            <div id={'label-and-input'} className={'flex w-full flex-row justify-between'}>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalizeFirstLetter(t(PrefixCollection.attributes(current)))}
                    </p>
                    <Input
                        type={'number'}
                        value={character.attributes[current]}
                        className={'w-[10ch] text-right'}
                        onChange={createInputHandler(setAttribute, current, {
                            // Fancy attributes DO NOT allow for negative values.
                            // Look, there can't be negative health, right? As well as negative AP or Armor.
                            allowNegative: false,
                            maxVal: character.attributes[max],
                        })}
                    />
                </div>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <Input
                        type={'number'}
                        value={character.attributes[max]}
                        className={'w-[10ch] text-right'}
                        onChange={(e) => {
                            const handler = createInputHandler(setAttribute, max, {
                                allowNegative: false,
                            })
                            handler(e)
                            if (character.attributes[current] > character.attributes[max]) {
                                setAttribute(current, character.attributes[max])
                            }
                        }}
                    />
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalizeFirstLetter(t(PrefixCollection.attributes(max)))}
                    </p>
                </div>
            </div>
            <div id={'bar'}>
                <Progress
                    value={Math.min(100, percentage)}
                    colored={{
                        empty: 'bg-gray-700',
                        fill: `bg-${color}-500`,
                    }}
                    className={'rounded-lg'}
                    width={'w-full'}
                    height={'h-6'}
                />
            </div>
        </div>
    )
}

const DualAttributeEditor = ({
    attributeKey,
    value,
    setAttribute,
}: {
    attributeKey: string
    value: string
    setAttribute: setAttributeFuncType
}) => {
    const [attack, defense] = value.split('/')
    const { t } = useTranslation()

    return (
        <div className={'flex flex-col gap-3 py-2 text-base'}>
            <div id={'label-and-input'} className={'flex w-full flex-row justify-between'}>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <Input
                        type={'number'}
                        value={parseInt(attack)}
                        className={'w-[10ch] text-right'}
                        onChange={createInputHandler(setAttribute, `${attributeKey}_attack`, {
                            allowNegative: true,
                        })}
                    />
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalizeFirstLetter(t(PrefixCollection.attributes(`${attributeKey}_attack`)))}
                    </p>
                </div>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalizeFirstLetter(t(PrefixCollection.attributes(`${attributeKey}_defense`)))}
                    </p>
                    <Input
                        type={'number'}
                        value={parseInt(defense)}
                        className={'w-[10ch] text-right'}
                        onChange={createInputHandler(setAttribute, `${attributeKey}_defense`, {
                            allowNegative: true,
                        })}
                    />
                </div>
            </div>
        </div>
    )
}

const AttributesEditor = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { attributes: attributesFlags } = flags
    const { t } = useTranslation()
    const [handledByOther, setHandledByOther] = useState<Array<string>>([])
    const [duals, dualsKeys] = useMemo(() => {
        return extractDualAttributes(character.attributes, attributesFlags?.ignored || [])
    }, [character, attributesFlags, handledByOther])
    const fancyCanBeCreatedFor: FancyAttributeArray = useMemo(() => {
        return extractCurrentMaxBaseAttributes(character.attributes, attributesFlags?.ignored || [])
    }, [character, attributesFlags, handledByOther])

    useEffect(() => {
        const handledAttributes = [
            ...fancyCanBeCreatedFor
                .map((fancyAttribute) => {
                    return [fancyAttribute.current, fancyAttribute.max]
                })
                .flat(),
            ...dualsKeys,
        ]

        if (JSON.stringify(handledAttributes) !== JSON.stringify(handledByOther)) {
            setHandledByOther(handledAttributes)
        }
    }, [fancyCanBeCreatedFor, handledByOther])

    const setAttribute = useCallback(
        (attribute: string, value: number) => {
            updateCharacter({
                ...character,
                attributes: {
                    ...character.attributes,
                    [attribute]: value,
                },
            })
        },
        [character, updateCharacter]
    )

    return (
        <div className={'flex flex-col gap-4 border-2 px-4 py-2 text-base'}>
            {fancyCanBeCreatedFor ? (
                <>
                    {fancyCanBeCreatedFor.map((fancyAttribute, index) => {
                        return (
                            <FancyAttributesWithBar
                                key={index}
                                current={fancyAttribute.current}
                                max={fancyAttribute.max}
                                color={fancyAttribute.color}
                                setAttribute={setAttribute}
                            />
                        )
                    })}
                </>
            ) : null}
            {Object.entries(character.attributes).map(([attribute, value]) => {
                if (attributesFlags?.ignored?.includes(attribute) || handledByOther.includes(attribute)) return null
                return (
                    <div key={attribute} className={'flex items-center justify-between'} id={'changeable'}>
                        <p className={'w-full max-w-[70%] break-words'}>
                            {capitalizeFirstLetter(t(PrefixCollection.attributes(attribute)))}
                        </p>
                        <Input
                            type={'number'}
                            value={value}
                            className={'w-[10ch] text-right'}
                            onChange={createInputHandler(setAttribute, attribute, {
                                allowNegative: true,
                            })}
                            disabled={attributesFlags?.nonEditable?.includes(attribute)}
                        />
                    </div>
                )
            })}
            {duals && duals.length > 0 ? (
                <>
                    {duals.map(({ value, key }, index) => {
                        return (
                            <DualAttributeEditor
                                key={index}
                                attributeKey={key}
                                value={value}
                                setAttribute={setAttribute}
                            />
                        )
                    })}
                </>
            ) : null}
        </div>
    )
}

export default AttributesEditor
