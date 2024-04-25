import { Dispatch } from '@reduxjs/toolkit'
import { resetState } from './slices/battlefieldSlice'
import { resetTurnSlice } from './slices/turnSlice'

const constructHighAction = (...actions: any[]) => {
    return () => (dispatch: Dispatch) => {
        actions.forEach((action) => dispatch(action()))
    }
}

export const resetGameComponentsStateAction = constructHighAction(resetTurnSlice, resetState)
