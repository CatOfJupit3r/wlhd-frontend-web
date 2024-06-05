import {FC, JSX, useCallback, useEffect, useState} from 'react'
import {
    CharacterFeaturesType,
    ItemInfo,
    SpellInfo,
    StatusEffectInfo,
    WeaponInfo,
} from '../../../models/Battlefield'

interface ItemProviderProps {
    type: 'item'
    component: (data: ItemInfo) => JSX.Element
}

interface WeaponProviderProps {
    type: 'weapon'
    component: (data: WeaponInfo) => JSX.Element
}

interface SpellProviderProps {
    type: 'spell'
    component: (data: SpellInfo) => JSX.Element
}

interface AttributeProviderProps {
    type: 'attributes'
    component: (data: { [key: string ]: string}) => JSX.Element
}

interface StatusEffectProviderProps {
    type: 'status_effect'
    component: (data: StatusEffectInfo) => JSX.Element
}

type FeatureProps = ItemProviderProps | WeaponProviderProps | SpellProviderProps | StatusEffectProviderProps | AttributeProviderProps

const FeatureProvider: FC<FeatureProps> = ({ type, component }) => {
    const [provided, setProvided] = useState<CharacterFeaturesType | null>(null)

    useEffect(() => {
        // API call => no error ? setProvided(data as CharacterFeaturesType) : setProvided(null)
    }, [type]);

    const Loading = useCallback(() => {
        return <div>Loading...</div>
    }, [])

    const ProvidedContent = useCallback(() => {
        if (!provided) {
            return <Loading />
        }
        switch (type) {
            case 'item':
                return component(provided as ItemInfo)
            case 'weapon':
                return component(provided as WeaponInfo)
            case 'spell':
                return component(provided as SpellInfo)
            case 'status_effect':
                return component(provided as StatusEffectInfo)
            default:
                return <div>Something went wrong. Give developers screenshot of me! {type} ({typeof type}), {typeof provided} </div>
        }
    }, [type, provided])

    return (
        <div id={`${type}-provider`}>
            <ProvidedContent />
        </div>
    )
}

export default FeatureProvider
