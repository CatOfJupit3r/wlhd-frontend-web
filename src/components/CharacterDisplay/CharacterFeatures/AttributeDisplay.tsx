import { capitalize } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Separator } from '@components/ui/separator';
import { CharacterAttributes } from '@models/GameModels';
import { splitDescriptor } from '@utils';
import { extractDualAttributes } from '@utils/game-display-tools';

const addPrefix = (prefix: string, value: string): string => {
    const [dlc, key] = splitDescriptor(value);
    return `${dlc}:${prefix}.${key}`;
};

const Attribute = ({ name, value }: { name: string; value: string }) => {
    const { t } = useTranslation();

    return (
        <div className={'mb-0.5 flex flex-row justify-between text-base'}>
            <p className={'font-normal'}>{capitalize(t(addPrefix('attributes', name)))}</p>
            <p className={'font-bold'}>{value}</p>
        </div>
    );
};

const AttributeDisplay = ({ attributes, ignore }: { attributes: CharacterAttributes; ignore: Array<string> }) => {
    const [ignored, setIgnored] = useState<Array<string>>(ignore);

    const [dual, setDuals] = useState<Array<{ key: string; value: string }>>([]);
    const [singular, setSingulars] = useState<Array<{ key: string; value: string }>>([]);

    const [processedDuals, setProcessedDuals] = useState<boolean>(false);
    const [processedSingulars, setProcessedSingulars] = useState<boolean>(false);

    const addIgnored = useCallback(
        (attribute: string) => {
            setIgnored([...ignored, attribute]);
        },
        [ignored],
    );

    const addManyIgnored = useCallback(
        (...attributes: string[]) => {
            setIgnored([...ignored, ...attributes]);
        },
        [ignored],
    );

    const extractDuals = useCallback((): Array<{
        key: string;
        value: string;
    }> => {
        const [extracted, extractedNames] = extractDualAttributes(attributes, ignored);
        addManyIgnored(...extractedNames);
        return extracted;
    }, []);

    const extractSingulars = useCallback((): Array<{ key: string; value: string }> => {
        const found_attributes: Array<{ key: string; value: string }> = [];
        for (const attribute in attributes) {
            if (ignored.includes(attribute)) continue;
            if (!attribute.endsWith('_attack') && !attribute.endsWith('_defense')) {
                found_attributes.push({ key: attribute, value: `${attributes[attribute]}` });
                addIgnored(attribute);
            }
        }
        return found_attributes;
    }, []);

    const healthAPDefenseValues = useMemo((): { [p: string]: string } => {
        return {
            health: `${attributes['builtins:current_health'] || '-'}/${attributes['builtins:max_health'] || '-'}`,
            actionPoints: `${attributes['builtins:current_action_points'] || '-'}/${attributes['builtins:max_action_points'] || '-'}`,
            armor: `${attributes['builtins:current_armor'] || '-'}/${attributes['builtins:base_armor'] || '-'}`,
        };
    }, [attributes]);

    useEffect(() => {
        setProcessedDuals(false);
        setProcessedSingulars(false);
    }, [attributes]);

    useEffect(() => {
        setIgnored(ignore);
    }, [ignore]);

    useEffect(() => {
        setDuals(extractDuals());
    }, [attributes]);

    useEffect(() => {
        if (!processedSingulars && processedDuals) {
            setSingulars(extractSingulars());
            setProcessedSingulars(true);
        }
    }, [processedSingulars, processedDuals]);

    useEffect(() => {
        if (!processedDuals) {
            setDuals(extractDuals());
            setProcessedDuals(true);
        }
    }, [processedDuals]);

    return processedDuals && processedSingulars ? (
        <div className={'flex flex-col gap-2 text-base'}>
            <div>
                {!ignored.includes('builtins:current_health') && !ignored.includes('builtins:max_health') && (
                    <Attribute
                        name={'builtins:health'}
                        value={healthAPDefenseValues.health}
                        key="special-attr-health"
                    />
                )}
                {!ignored.includes('builtins:current_action_points') &&
                    !ignored.includes('builtins:max_action_points') && (
                        <Attribute
                            name={'builtins:action_points'}
                            value={healthAPDefenseValues.actionPoints}
                            key="special-attr-ap"
                        />
                    )}
                {!ignored.includes('builtins:current_armor') && !ignored.includes('builtins:base_armor') && (
                    <Attribute name={'builtins:armor'} value={healthAPDefenseValues.armor} key={'special-attr-armor'} />
                )}
            </div>
            <Separator />
            <div>
                {singular.map((attribute, index) => (
                    <Attribute name={attribute.key} value={attribute.value} key={`sing-attr-${index}`} />
                ))}
            </div>
            <Separator />
            <div>
                {dual.map((attribute, index) => (
                    <Attribute name={attribute.key} value={attribute.value} key={`duo-attr-${index}`} />
                ))}
            </div>
            <Separator />
        </div>
    ) : null;
};

export default AttributeDisplay;
