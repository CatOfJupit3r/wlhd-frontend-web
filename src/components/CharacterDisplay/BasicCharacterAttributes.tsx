import React, { useMemo } from 'react'
import { EntityInfoFull } from '@models/Battlefield'
import ElementWithIcon from '@components/ElementWithIcon'
import { APIcon, ArmorIcon, HealthIcon } from '@components/icons'

const BasicCharacterAttributes = ({ attributes }: { attributes: EntityInfoFull['attributes'] }) => {
    const MAIN_ATTRIBUTES = useMemo(
        () => ({
            HEALTH: {
                icon: HealthIcon,
                text: `${attributes['builtins:current_health'] || '-'}/${attributes['builtins:max_health'] || '-'}`,
            },
            ARMOR: {
                icon: ArmorIcon,
                text: `${attributes['builtins:current_armor'] || '-'}/${attributes['builtins:base_armor'] || '-'}`,
            },
            AP: {
                icon: APIcon,
                text: `${attributes['builtins:current_action_points'] || '-'}/${attributes['builtins:max_action_points'] || '-'}`,
            },
        }),
        [attributes]
    )

    return (
        <div className={'flex flex-row gap-4'}>
            {Object.entries(MAIN_ATTRIBUTES).map(([key, { icon, text }]) => (
                <ElementWithIcon key={key} icon={icon({className: 'size-8'})} element={<p className={'text-t-small font-semibold'}>{text}</p>} />
            ))}
        </div>
    )
}

export default BasicCharacterAttributes
