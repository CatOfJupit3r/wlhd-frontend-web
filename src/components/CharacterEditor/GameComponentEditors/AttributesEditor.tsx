import { NumberInput } from '@components/ui/input';
import { Progress } from '@components/ui/progress';
import { useCharacterEditor } from '@context/character-editor';
import { getPercentage } from '@utils';
import {
    extractCurrentMaxBaseAttributes,
    extractDualAttributes,
    FancyAttributeArray,
    PrefixCollection,
} from '@utils/game-display-tools';
import { capitalize } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type setAttributeFuncType = (attribute: string, value: number) => void;

const FancyAttributesWithBar = ({
    current,
    max,
    color,
    setAttribute,
}: {
    current: string;
    max: string;
    color: string;
    setAttribute: setAttributeFuncType;
}) => {
    const { character } = useCharacterEditor();
    const { t } = useTranslation();
    const percentage = getPercentage(character.attributes[current], character.attributes[max]);

    return (
        <div className={'flex flex-col gap-3 py-2 text-base'}>
            <div id={'label-and-input'} className={'flex w-full flex-row justify-between'}>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalize(t(PrefixCollection.attributes(current)))}
                    </p>
                    <NumberInput
                        value={character.attributes[current]}
                        className={'w-[10ch] text-right'}
                        min={0}
                        max={character.attributes[max]}
                        onChange={(value) => {
                            setAttribute(current, value);
                        }}
                    />
                </div>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <NumberInput
                        value={character.attributes[max]}
                        className={'w-[10ch] text-right'}
                        min={0}
                        max={character.attributes[max]}
                        onChange={(value) => {
                            setAttribute(max, value);
                            if (value < character.attributes[current]) {
                                setAttribute(current, value);
                            }
                        }}
                    />
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalize(t(PrefixCollection.attributes(max)))}
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
    );
};

const DualAttributeEditor = ({
    attributeKey,
    value,
    setAttribute,
}: {
    attributeKey: string;
    value: string;
    setAttribute: setAttributeFuncType;
}) => {
    const [attack, defense] = value.split('/');
    const { t } = useTranslation();

    return (
        <div className={'flex flex-col gap-3 py-2 text-base'}>
            <div id={'label-and-input'} className={'flex w-full flex-row justify-between'}>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <NumberInput
                        value={parseInt(attack)}
                        className={'w-[10ch] text-right'}
                        max={99999}
                        min={-99999}
                        onChange={(value) => {
                            setAttribute(`${attributeKey}_attack`, value);
                        }}
                    />
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalize(t(PrefixCollection.attributes(`${attributeKey}_attack`)))}
                    </p>
                </div>
                <div className={'flex max-w-[50%] flex-row items-center gap-1'}>
                    <p className={'w-full max-w-[70%] break-words'}>
                        {capitalize(t(PrefixCollection.attributes(`${attributeKey}_defense`)))}
                    </p>
                    <NumberInput
                        value={parseInt(defense)}
                        className={'w-[10ch] text-right'}
                        max={99999}
                        min={-99999}
                        onChange={(value) => {
                            setAttribute(`${attributeKey}_defense`, value);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const AttributesEditor = () => {
    const { character, flags, changeCharacterAttribute } = useCharacterEditor();
    const { attributes: attributesFlags } = flags;
    const { t } = useTranslation();
    const [handledByOther, setHandledByOther] = useState<Array<string>>([]);
    const [duals, dualsKeys] = useMemo(() => {
        return extractDualAttributes(character.attributes, attributesFlags?.ignored || []);
    }, [character, attributesFlags, handledByOther]);
    const fancyCanBeCreatedFor: FancyAttributeArray = useMemo(() => {
        return extractCurrentMaxBaseAttributes(character.attributes, attributesFlags?.ignored || []);
    }, [character, attributesFlags, handledByOther]);

    useEffect(() => {
        const handledAttributes = [
            ...fancyCanBeCreatedFor
                .map((fancyAttribute) => {
                    return [fancyAttribute.current, fancyAttribute.max];
                })
                .flat(),
            ...dualsKeys,
        ];

        if (JSON.stringify(handledAttributes) !== JSON.stringify(handledByOther)) {
            setHandledByOther(handledAttributes);
        }
    }, [fancyCanBeCreatedFor, handledByOther]);

    const setAttribute = useCallback(
        (attribute: string, value: number) => {
            changeCharacterAttribute({
                attribute,
                value,
            });
        },
        [changeCharacterAttribute],
    );

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
                        );
                    })}
                </>
            ) : null}
            {Object.entries(character.attributes).map(([attribute, value]) => {
                if (attributesFlags?.ignored?.includes(attribute) || handledByOther.includes(attribute)) return null;
                return (
                    <div key={attribute} className={'flex items-center justify-between'} id={'changeable'}>
                        <p className={'w-full max-w-[70%] break-words'}>
                            {capitalize(t(PrefixCollection.attributes(attribute)))}
                        </p>
                        <NumberInput
                            value={value}
                            className={'w-[10ch] text-right'}
                            max={99999}
                            min={-99999}
                            onChange={(value) => {
                                setAttribute(attribute, value);
                            }}
                            disabled={attributesFlags?.nonEditable?.includes(attribute)}
                        />
                    </div>
                );
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
                        );
                    })}
                </>
            ) : null}
        </div>
    );
};

export default AttributesEditor;
