interface IDuals {
    key: string;
    value: string;
}

interface iFancyAttribute {
    current: string;
    max: string;
    color: string;
}

export type FancyAttributeArray = iFancyAttribute[];

export const addPrefixBeforeDLC = (input: string, prefix: string): string => {
    const inputArray = input.split(':');
    const dlc = inputArray.shift();
    return `${dlc}:${prefix}.${inputArray.join('.')}`;
};

export const PrefixCollection = {
    tags: (input: string): string => addPrefixBeforeDLC(input, 'tags'),
    flags: (input: string): string => addPrefixBeforeDLC(input, 'flags'),
    attributes: (input: string): string => addPrefixBeforeDLC(input, 'attributes'),
    items: (input: string): string => addPrefixBeforeDLC(input, 'items'),
    weapons: (input: string): string => addPrefixBeforeDLC(input, 'weapons'),
    spells: (input: string): string => addPrefixBeforeDLC(input, 'spells'),
    statusEffects: (input: string): string => addPrefixBeforeDLC(input, 'statusEffects'),
    memories: (input: string): string => addPrefixBeforeDLC(input, 'memories'),
    characters: (input: string): string => addPrefixBeforeDLC(input, 'characters'),
};

export const extractDualAttributes = (
    attributes: Record<string, number>,
    ignored: string[],
): [IDuals[], Set<string>] => {
    const found_attribute_names = new Set<string>();
    const found_attributes: IDuals[] = [];
    for (const attribute in attributes) {
        if (ignored.includes(attribute) || found_attribute_names.has(attribute)) continue;
        if (attribute.endsWith('_attack')) {
            const attribute_name = attribute.slice(0, -7);
            const defense_attribute = `${attribute_name}_defense`;
            if (defense_attribute in attributes) {
                found_attributes.push({
                    key: attribute_name,
                    value: `${attributes[attribute]}/${attributes[defense_attribute]}`,
                });

                found_attribute_names.add(defense_attribute);
                found_attribute_names.add(attribute);
            }
        } else if (attribute.endsWith('_defense')) {
            const attribute_name = attribute.slice(0, -8);
            const attack_attribute = `${attribute_name}_attack`;
            if (attack_attribute in attributes) {
                found_attributes.push({
                    key: attribute_name,
                    value: `${attributes[attack_attribute]}/${attributes[attribute]}`,
                });

                found_attribute_names.add(attribute);
                found_attribute_names.add(attack_attribute);
            }
        }
    }

    return [found_attributes, found_attribute_names];
};

export const extractCurrentMaxBaseAttributes = (
    attributes: Record<string, number>,
    ignored: string[],
): FancyAttributeArray => {
    const res = [];
    for (const key in attributes) {
        if (ignored?.includes(key)) continue;
        if (!key.includes(':')) continue;
        const [dlc_tag, attribute] = key.split(':');
        const hasCurrent = attribute?.startsWith('current_');
        if (!hasCurrent) continue;
        const attributeWithoutCurrent = attribute.replace('current_', '');
        if (attributeWithoutCurrent === '') continue;
        const pseudoMaxAttributeKey = `${dlc_tag}:max_${attributeWithoutCurrent}`;
        const hasMax = pseudoMaxAttributeKey in attributes;
        if (hasMax) {
            res.push({
                current: key,
                max: pseudoMaxAttributeKey,
                color: AttributeColoringMap.get(attributeWithoutCurrent) ?? 'gray',
            });
            continue;
        }
        const pseudoBaseAttributeKey = `${dlc_tag}:base_${attributeWithoutCurrent}`;
        const hasBase = pseudoBaseAttributeKey in attributes;
        if (hasBase) {
            res.push({
                current: key,
                max: pseudoBaseAttributeKey,
                color: AttributeColoringMap.get(attributeWithoutCurrent) ?? 'gray',
            });
        }
    }
    return res;
};
export const AttributeColoringMap = new Map<string, string>([
    ['health', 'red'],
    ['action_points', 'green'],
    ['armor', 'amber'],
]);
