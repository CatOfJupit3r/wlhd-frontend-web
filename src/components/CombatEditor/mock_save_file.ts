export default {
    round: 1,
    turnOrder: ['0', '1', null, '2'],
    battlefield: {
        '4/3': {
            descriptor: 'builtins:target_dummy',
            source: {
                decorations: {
                    name: 'builtins:target_dummy.name',
                    sprite: 'builtins:target_dummy',
                    description: 'builtins:target_dummy.desc',
                },
                attributes: {
                    'builtins:current_health': 250,
                    'builtins:max_health': 250,
                    'builtins:current_action_points': 1,
                    'builtins:max_action_points': 10,
                    'builtins:current_armor': 0,
                    'builtins:base_armor': 100,
                    'builtins:weapon_bonus_damage': 0,
                    'builtins:weapon_healing_damage': 0,
                    'builtins:athletics': 0,
                    'builtins:caution': 0,
                    'builtins:dexterity': 0,
                    'builtins:persuasion': 0,
                    'builtins:medicine': 0,
                    'builtins:will': 0,
                    'builtins:reflexes': 0,
                    'builtins:strength': 0,
                    'builtins:nature_defense': 0,
                    'builtins:nature_attack': 0,
                    'builtins:fire_defense': 0,
                    'builtins:fire_attack': 0,
                    'builtins:water_defense': 0,
                    'builtins:water_attack': 0,
                    'builtins:earth_defense': 0,
                    'builtins:earth_attack': 0,
                    'builtins:air_defense': 0,
                    'builtins:air_attack': 0,
                    'builtins:light_defense': 0,
                    'builtins:light_attack': 0,
                    'builtins:dark_defense': 0,
                    'builtins:dark_attack': 0,
                    'builtins:physical_attack': 20,
                    'builtins:physical_defense': 10,
                },
                spellBook: {
                    maxActiveSpells: 0,
                    knownSpells: [],
                },
                inventory: [
                    {
                        descriptor: 'builtins:healing_potion',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                    },
                ],
                statusEffects: [],
                weaponry: [],
                id_: '0',
            },
            control: {
                type: 'game_logic',
            },
        },
        '3/5': {
            descriptor: 'builtins:hero',
            source: {
                decorations: {
                    name: 'builtins:hero.name',
                    sprite: 'builtins:hero',
                    description: 'builtins:hero.desc',
                },
                attributes: {
                    'builtins:current_health': 100,
                    'builtins:max_health': 100,
                    'builtins:current_action_points': 0,
                    'builtins:max_action_points': 10,
                    'builtins:current_armor': 0,
                    'builtins:base_armor': 50,
                    'builtins:weapon_bonus_damage': 0,
                    'builtins:weapon_healing_damage': 0,
                    'builtins:athletics': 0,
                    'builtins:caution': 0,
                    'builtins:dexterity': 0,
                    'builtins:persuasion': 0,
                    'builtins:medicine': 0,
                    'builtins:will': 0,
                    'builtins:reflexes': 0,
                    'builtins:strength': 0,
                    'builtins:nature_defense': 0,
                    'builtins:nature_attack': 0,
                    'builtins:fire_defense': 0,
                    'builtins:fire_attack': 0,
                    'builtins:water_defense': 0,
                    'builtins:water_attack': 0,
                    'builtins:earth_defense': 0,
                    'builtins:earth_attack': 0,
                    'builtins:air_defense': 0,
                    'builtins:air_attack': 0,
                    'builtins:light_defense': 0,
                    'builtins:light_attack': 0,
                    'builtins:dark_defense': 0,
                    'builtins:dark_attack': 0,
                    'builtins:physical_attack': 10,
                    'builtins:physical_defense': 10,
                },
                spellBook: {
                    maxActiveSpells: 4,
                    knownSpells: [
                        {
                            descriptor: 'builtins:fireball',
                            isActive: true,
                            turnsUntilUsage: 0,
                            currentConsecutiveUses: 0,
                        },
                    ],
                },
                inventory: [
                    {
                        descriptor: 'builtins:healing_potion',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                    },
                    {
                        descriptor: 'builtins:healing_potion',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                    },
                    {
                        descriptor: 'builtins:healing_potion',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                    },
                    {
                        descriptor: 'builtins:healing_potion',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                    },
                ],
                statusEffects: [],
                weaponry: [
                    {
                        descriptor: 'builtins:hero_sword',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                        isActive: false,
                    },
                ],
                id_: '2',
            },
            control: {
                type: 'player',
                id: '660953204bd5e6d58ed510d2',
            },
        },
        '4/5': {
            descriptor: 'coordinator:mage',
            source: {
                decorations: {
                    name: 'The Mage',
                    description:
                        'Wise elvish desdendant, destined to learn forbidden knowledge and to help The Hero slay The Demon King',
                    sprite: 'ally',
                },
                attributes: {
                    'builtins:current_health': 75,
                    'builtins:max_health': 75,
                    'builtins:current_action_points': 0,
                    'builtins:max_action_points': 5,
                    'builtins:current_armor': 0,
                    'builtins:base_armor': 0,
                    'builtins:weapon_bonus_damage': 0,
                    'builtins:weapon_healing_damage': 0,
                    'builtins:athletics': 0,
                    'builtins:caution': 0,
                    'builtins:dexterity': 0,
                    'builtins:persuasion': 0,
                    'builtins:medicine': 0,
                    'builtins:will': 0,
                    'builtins:reflexes': 0,
                    'builtins:strength': 0,
                    'builtins:nature_defense': 0,
                    'builtins:nature_attack': 0,
                    'builtins:fire_defense': 0,
                    'builtins:fire_attack': 0,
                    'builtins:water_defense': 0,
                    'builtins:water_attack': 0,
                    'builtins:earth_defense': 0,
                    'builtins:earth_attack': 0,
                    'builtins:air_defense': 0,
                    'builtins:air_attack': 0,
                    'builtins:light_defense': 0,
                    'builtins:light_attack': 0,
                    'builtins:dark_defense': 0,
                    'builtins:dark_attack': 0,
                },
                spellBook: {
                    maxActiveSpells: 0,
                    knownSpells: [],
                },
                inventory: [],
                statusEffects: [
                    {
                        descriptor: 'builtins:moved',
                        duration: 1,
                    },
                ],
                weaponry: [
                    {
                        descriptor: 'builtins:hero_sword',
                        quantity: 1,
                        turnsUntilUsage: 0,
                        currentConsecutiveUses: 0,
                        isActive: true,
                    },
                ],
                id_: '1',
            },
            control: {
                type: 'player',
                id: '660953204bd5e6d58ed510d2',
            },
        },
    },
    messages: [
        [
            {
                key: 'builtins:creature_skips_turn',
                args: {
                    entity_name: 'builtins:target_dummy.name',
                    value: '10',
                },
            },
        ],
        [
            {
                key: 'builtins:spell_usage',
                args: {
                    entity_name: 'coordinator:mage.name',
                    spell_name: 'builtins:fireball.name',
                },
            },
            {
                key: 'builtins:creature_takes_damage',
                args: {
                    entity_name: 'builtins:target_dummy.name',
                    damage: '8',
                    element_of_hp_change: 'builtins:fire',
                },
            },
            {
                key: 'builtins:creature_spent_ap',
                args: {
                    entity_name: 'coordinator:mage.name',
                    value: '0',
                },
            },
        ],
    ],
}
