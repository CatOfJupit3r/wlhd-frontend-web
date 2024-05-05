import React from 'react'
import { useSelector } from 'react-redux'
import { selectControlledEntities } from '../../../redux/slices/infoSlice'

const ControlledEntitiesInfo = () => {
    const controlledEntities = useSelector(selectControlledEntities)

    return (<div>
            <h1>Controlled Entities Info</h1>
        </div>
    )
}

export default ControlledEntitiesInfo