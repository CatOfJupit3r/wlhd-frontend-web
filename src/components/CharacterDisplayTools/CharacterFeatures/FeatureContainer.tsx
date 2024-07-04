import AttributeDisplay from '@components/EntityDisplay/AttributeDisplay/AttributeDisplay'
import InfoDisplay from '@components/EntityDisplay/InfoDisplay/InfoDisplay'
import {
    fetchCharacterAttributes,
    fetchCharacterInventory,
    fetchCharacterSpellbook,
    fetchCharacterStatusEffects,
    fetchCharacterWeaponry,
    resetCharacterFeatures,
    selectAttributes,
    selectDescriptor,
    selectInventory,
    selectLoading,
    selectSpells,
    selectStatusEffects,
    selectWeaponry,
} from '@redux/slices/characterSlice'
import { selectLobbyId } from '@redux/slices/lobbySlice'
import { AppDispatch } from '@redux/store'
import { FC, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface ItemContainerProps {
    type: 'inventory'
}

interface WeaponContainerProps {
    type: 'weaponry'
}

interface SpellContainerProps {
    type: 'spells'
}

interface AttributeContainerProps {
    type: 'attributes'
}

interface StatusEffectContainerProps {
    type: 'statusEffects'
}

type ProvidingProps =
    | ItemContainerProps
    | WeaponContainerProps
    | SpellContainerProps
    | StatusEffectContainerProps
    | AttributeContainerProps
type FeatureProps = ProvidingProps

const FeatureContainer: FC<FeatureProps> = ({ type }) => {
    const descriptor = useSelector(selectDescriptor)
    const lobbyId = useSelector(selectLobbyId)
    const dispatch = useDispatch<AppDispatch>()
    const loading = useSelector(selectLoading)

    const [descriptorChanged, setDescriptorChanged] = useState(false)

    useEffect(() => {
        if (!descriptor) {
            return
        }
        dispatch(resetCharacterFeatures())
        setDescriptorChanged(true)
    }, [descriptor])

    useEffect(() => {
        if (!descriptor || !lobbyId) {
            return
        }
        if (!descriptorChanged && ['pending', 'fulfilled', 'rejected'].includes(loading[type])) {
            return
        }
        switch (type) {
            case 'inventory':
                dispatch(fetchCharacterInventory(lobbyId))
                break
            case 'weaponry':
                dispatch(fetchCharacterWeaponry(lobbyId))
                break
            case 'spells':
                dispatch(fetchCharacterSpellbook(lobbyId))
                break
            case 'statusEffects':
                dispatch(fetchCharacterStatusEffects(lobbyId))
                break
            case 'attributes':
                dispatch(fetchCharacterAttributes(lobbyId))
                break
            default:
                break
        }
        setDescriptorChanged(false)
    }, [descriptorChanged, lobbyId, type])

    const Loading = useCallback(() => {
        return <div>Loading...</div>
    }, [])

    const FailedToLoad = useCallback(() => {
        return <div>Failed to load...</div>
    }, [])

    const LoadingQM = useCallback(() => {
        return <div>Loading?</div>
    }, [])

    const DecideOnLoad = useCallback((isLoaded: string, content: () => JSX.Element): JSX.Element => {
        switch (isLoaded) {
            case 'fulfilled':
                return content()
            case 'rejected':
                return <FailedToLoad />
            case 'pending':
                return <Loading />
            default:
                return <LoadingQM />
        }
    }, [])

    const Inventory = useCallback(() => {
        const [inventory, isLoaded] = useSelector(selectInventory)

        return DecideOnLoad(isLoaded, () => (
            <>
                {inventory.map((value, index) => {
                    return <InfoDisplay type={'item'} info={value} key={index} />
                })}
            </>
        ))
    }, [descriptor])

    const StatusEffects = useCallback(() => {
        const [effects, isLoaded] = useSelector(selectStatusEffects)

        return DecideOnLoad(isLoaded, () => (
            <>
                {effects.map((value, index) => {
                    return <InfoDisplay type={'status_effect'} info={value} key={index} />
                })}
            </>
        ))
    }, [descriptor])

    const Weaponry = useCallback(() => {
        const [weaponry, isLoaded] = useSelector(selectWeaponry)

        return DecideOnLoad(isLoaded, () => (
            <>
                {weaponry.map((value, index) => {
                    return <InfoDisplay type={'weapon'} info={value} key={index} />
                })}
            </>
        ))
    }, [descriptor])

    const SpellBook = useCallback(() => {
        const [{ spellBook, spellLayout }, isLoaded] = useSelector(selectSpells)

        return DecideOnLoad(isLoaded, () => (
            <>
                {spellBook.map((value, index) => {
                    return (
                        <InfoDisplay
                            type={'spell'}
                            info={{
                                ...value,
                                isActive: spellLayout.layout.includes(value.descriptor),
                            }}
                            key={index}
                        />
                    )
                })}
            </>
        ))
    }, [descriptor])

    const Attributes = useCallback(() => {
        const [inventory, isLoaded] = useSelector(selectAttributes)

        return DecideOnLoad(isLoaded, () => (
            <>
                <AttributeDisplay attributes={inventory} includeHealthAPDefense={true} />
            </>
        ))
    }, [descriptor])

    const ProvidedContent = useCallback(() => {
        switch (type) {
            case 'inventory': {
                return <Inventory />
            }
            case 'spells': {
                return <SpellBook />
            }
            case 'weaponry': {
                return <Weaponry />
            }
            case 'attributes': {
                return <Attributes />
            }
            case 'statusEffects': {
                return <StatusEffects />
            }
            default: {
                return <Loading />
            }
        }
    }, [type])

    return (
        <div
            id={`${type}-container`}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <ProvidedContent />
        </div>
    )
}

export default FeatureContainer
