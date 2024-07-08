import createIconComponent, { IconComponentType } from '@components/icons/icon_factory'

const Icons = [
    {
        src: '/assets/cr/attributes.svg',
        alt: 'attributes',
        displayName: 'AttributesIcon',
    }, {
        src: '/assets/cr/inventory.svg',
        alt: 'inventory',
        displayName: 'InventoryIcon',
    }, {
        src: '/assets/cr/status_effects.svg',
        alt: 'status effects',
        displayName: 'StatusEffectsIcon',
    },
    {
        src: '/assets/cr/spell_book.svg',
        alt: 'spells',
        displayName: 'SpellsIcon',
    },
    {
        src: '/assets/cr/weaponry.svg',
        alt: 'weaponry',
        displayName: 'WeaponryIcon',
    },
    {
        src: '/assets/local/cooldown.png',
        alt: 'cooldown',
        displayName: 'CooldownIcon',
    },
    {
        src: '/assets/local/available_icon.svg',
        alt: 'active',
        displayName: 'ActiveIcon',
    },
]


const iconExports = Icons.reduce((acc, { src, alt, displayName }) => {
    acc[displayName] = createIconComponent(src, alt, displayName)
    return acc
}, {} as { [key: string]: IconComponentType })

export const {
    AttributesIcon,
    InventoryIcon,
    StatusEffectsIcon,
    SpellsIcon,
    WeaponryIcon,
    CooldownIcon,
    ActiveIcon,
} = iconExports