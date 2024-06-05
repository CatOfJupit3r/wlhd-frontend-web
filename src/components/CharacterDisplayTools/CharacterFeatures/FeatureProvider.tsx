import { FC, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '../../../models/Battlefield'
import { selectLobbyId } from '../../../redux/slices/lobbySlice'
import APIService from '../../../services/APIService'
import AttributeDisplay from '../../EntityDisplay/AttributeDisplay/AttributeDisplay'
import InfoDisplay from '../../EntityDisplay/InfoDisplay/InfoDisplay'

interface ItemProviderProps {
    type: 'item'
}

interface WeaponProviderProps {
    type: 'weapon'
}

interface SpellProviderProps {
    type: 'spell'
}

interface AttributeProviderProps {
    type: 'attributes'
}

interface StatusEffectProviderProps {
    type: 'status_effect'
}

type ProvidingProps =
    | ItemProviderProps
    | WeaponProviderProps
    | SpellProviderProps
    | StatusEffectProviderProps
    | AttributeProviderProps
type FeatureProps = ProvidingProps

interface AttributesInfo {
    [attribute: string]: string
}

type ProvidedState = Array<ItemInfo> | Array<WeaponInfo> | Array<SpellInfo> | Array<StatusEffectInfo>

const FeatureProvider: FC<FeatureProps> = ({ type }) => {
    const [provided, setProvided] = useState<ProvidedState | AttributesInfo | null>(null)
    const [spellLayout, setSpellLayout] = useState({} as { layout: Array<string>; conflicts: unknown })
    const descriptor = 'hero' // TODO: Change to ContextAPI
    const lobbyId = useSelector(selectLobbyId)

    /* test data
    useEffect(() => { 
        // API call => no error ? setProvided(data as CharacterFeaturesType) : setProvided(null)
        switch (type) {
            case 'item':
                setProvided({
                    descriptor: 'item1',
                    decorations: { name: 'Item 1', description: 'This is item 1', sprite: 'item1.png' },
                    cost: 10,
                    uses: { current: 1, max: 1 },
                    user_needs_range: [1],
                    cooldown: { current: 0, max: 0 },
                    quantity: 1,
                    consumable: true,
                })
                break
            case 'weapon':
                setProvided({
                    descriptor: 'weapon1',
                    decorations: { name: 'Weapon 1', description: 'This is weapon 1', sprite: 'weapon1.png' },
                    cost: 10,
                    uses: { current: 1, max: 1 },
                    user_needs_range: [1],
                    cooldown: { current: 0, max: 0 },
                    quantity: 1,
                    consumable: true,
                    isActive: true,
                })
                break
            case 'spell':
                setProvided({
                    descriptor: 'spell1',
                    decorations: { name: 'Spell 1', description: 'This is spell 1', sprite: 'spell1.png' },
                    cost: 10,
                    uses: { current: 1, max: 1 },
                    user_needs_range: [1],
                    cooldown: { current: 0, max: 0 },
                })
                break
            case 'status_effect':
                setProvided({
                    decorations: { name: 'Status Effect 1', description: 'This is status effect 1', sprite: 'status1.png' },
                    duration: '1d',
                })
                break
            case 'attributes':
                setProvided({
                    current_health: '10'
                })
                break
            default:
                setProvided(null)
        }
    }, [type]);
     */

    useEffect(() => {
        switch (type) {
            case 'item':
                APIService.getCharacterInventory(lobbyId, descriptor)
                    .then((data) => {
                        setProvided(data.inventory)
                    })
                    .catch(() => {
                        setProvided(null)
                    })
                break
            case 'weapon':
                APIService.getCharacterWeaponry(lobbyId, descriptor)
                    .then((data) => {
                        setProvided(data.weaponry)
                    })
                    .catch(() => {
                        setProvided(null)
                    })
                break
            case 'spell':
                APIService.getCharacterSpellbook(lobbyId, descriptor)
                    .then((data) => {
                        setProvided(data.spellBook)
                        setSpellLayout(data.spellLayout)
                    })
                    .catch(() => {
                        setProvided(null)
                    })
                break
            case 'status_effect':
                APIService.getCharacterStatusEffects(lobbyId, descriptor)
                    .then((data) => {
                        setProvided(data.statusEffects)
                    })
                    .catch(() => {
                        setProvided(null)
                    })
                break
            case 'attributes':
                APIService.getCharacterAttributes(lobbyId, descriptor)
                    .then((data) => {
                        setProvided(data.attributes)
                    })
                    .catch(() => {
                        setProvided(null)
                    })
                break
            default:
                setProvided(null)
        }
    }, [])

    const Loading = useCallback(() => {
        return <div>Loading...</div>
    }, [])

    const ProvidedContent = useCallback(() => {
        if (!provided) {
            return <Loading />
        }
        if (type === 'attributes') {
            return <AttributeDisplay attributes={provided as AttributesInfo} />
        } else if (type === 'spell') {
            // do something cool with layout maybeeee...
            return (
                <>
                    {(provided as ProvidedState).map((value, index) => {
                        return (
                            <InfoDisplay
                                type={type as any}
                                info={
                                    {
                                        ...value,
                                        isActive: spellLayout.layout.includes((value as SpellInfo).descriptor),
                                    } as any
                                }
                                key={index}
                            />
                        )
                    })}
                </>
            )
        } else if (['item', 'status_effect', 'weapon'].includes(type)) {
            return (
                <>
                    {(provided as ProvidedState).map((value, index) => {
                        return <InfoDisplay type={type as any} info={value as any} key={index} />
                    })}
                </>
            )
        } else {
            return (
                <div>
                    Something went wrong. Give developers screenshot of me! {type} ({typeof type}), {typeof provided}{' '}
                </div>
            )
        }
    }, [type, provided])

    return (
        <div id={`${type}-provider`}>
            <ProvidedContent />
        </div>
    )
}

export default FeatureProvider
