import { useCallback, useMemo } from 'react'
import { FaUsers } from 'react-icons/fa'
import { FaUncharted } from 'react-icons/fa6'
import { MdHistoryToggleOff, MdOutlineVideogameAssetOff } from 'react-icons/md'
import { TbManualGearbox } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setChosenMenu } from '../../redux/slices/infoSlice'

const MenuNavigator = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const optionNavigators = useMemo(
        () => [
            {
                Component: FaUsers,
                alt: 'Controlled Entities',
                value: 'your-entities',
            },
            {
                Component: FaUncharted,
                alt: 'Take action!',
                value: 'action-select',
            },
            {
                Component: MdHistoryToggleOff,
                alt: 'History',
                value: 'history',
            },
        ],
        []
    )

    const pageNavigators = useMemo(
        () => [
            {
                Component: TbManualGearbox,
                alt: 'GM Settings',
                value: 'gm-settings',
            },
            {
                Component: MdOutlineVideogameAssetOff,
                alt: 'Leave',
                value: undefined,
            },
        ],
        []
    )

    const generateOption = useCallback(
        (arr: typeof optionNavigators | typeof pageNavigators, componentKeyAlias: string) => {
            return arr.map((pageNavigator, index) => {
                const { Component, alt, value } = pageNavigator
                return (
                    <Component
                        key={`${componentKeyAlias}-${index}`}
                        title={alt}
                        style={{
                            marginBottom: '1vh',
                            height: '8vh',
                            width: '8vh',
                            color: 'white',
                        }}
                        onClick={() => {
                            console.log(alt)
                            if (value) {
                                dispatch(setChosenMenu(value))
                            } else {
                                navigate('..')
                            }
                        }}
                    />
                )
            })
        },
        []
    )

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1vh',
            }}
        >
            <div
                id={'option-navigators'}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {generateOption(optionNavigators, 'option-navigator')}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                id={'page-navigators'}
            >
                {generateOption(pageNavigators, 'page-navigator')}
            </div>
        </div>
    )
}

export default MenuNavigator
