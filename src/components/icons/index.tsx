import IconFactory from '@components/icons/icon_factory'

const Icons = {
    attributes: {
        src: '/assets/cr/attributes.svg',
        alt: 'attributes',
        displayName: 'AttributesIcon',
    },
    inventory: {
        src: '/assets/cr/inventory.svg',
        alt: 'inventory',
        displayName: 'InventoryIcon',
    },
    status_effects: {
        src: '/assets/cr/status_effects.svg',
        alt: 'status effects',
        displayName: 'StatusEffectsIcon',
    },
    spells: {
        src: '/assets/cr/spell_book.svg',
        alt: 'spells',
        displayName: 'SpellsIcon',
    },
    weaponry: {
        src: '/assets/cr/weaponry.svg',
        alt: 'weaponry',
        displayName: 'WeaponryIcon',
    },
    cooldown: {
        src: '/assets/local/cooldown.png',
        alt: 'cooldown',
        displayName: 'CooldownIcon',
    },
    active: {
        src: '/assets/local/available_icon.svg',
        alt: 'active',
        displayName: 'ActiveIcon',
    }
}

export const AttributesIcon = IconFactory(Icons.attributes.src, Icons.attributes.alt, Icons.attributes.displayName)
export const InventoryIcon = IconFactory(Icons.inventory.src, Icons.inventory.alt, Icons.inventory.displayName)
export const StatusEffectsIcon = IconFactory(
    Icons.status_effects.src,
    Icons.status_effects.alt,
    Icons.status_effects.displayName
)
export const SpellsIcon = IconFactory(Icons.spells.src, Icons.spells.alt, Icons.spells.displayName)
export const WeaponryIcon = IconFactory(Icons.weaponry.src, Icons.weaponry.alt, Icons.weaponry.displayName)
export const CooldownIcon = IconFactory(Icons.cooldown.src, Icons.cooldown.alt, Icons.cooldown.displayName)
export const ActiveIcon = IconFactory(Icons.active.src, Icons.active.alt, Icons.active.displayName)