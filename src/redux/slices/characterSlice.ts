import { AttributeInfo, ItemInfo, SpellInfo, StatusEffectInfo, WeaponInfo } from '@models/Battlefield'
import { CharacterState, LoadingState } from '@models/Redux'
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import APIService from '@services/APIService'
import { RootState } from '../store'

const initialState: CharacterState = {
    descriptor: '',
    fetched: {
        inventory: [],
        weaponry: [],
        spells: {
            spellBook: [],
            spellLayout: {
                layout: [],
                conflicts: '',
            },
        },
        statusEffects: [],
        attributes: {},
    },
    loading: {
        inventory: 'idle',
        weaponry: 'idle',
        spells: 'idle',
        statusEffects: 'idle',
        attributes: 'idle',
    },
}

export const fetchCharacterInventory = createAsyncThunk(
    'character/fetchInventory',
    async (lobbyId: string, ThunkAPI) => {
        return await APIService.getCharacterInventory(lobbyId, (ThunkAPI.getState() as RootState).character.descriptor)
    }
)

export const fetchCharacterWeaponry = createAsyncThunk('character/fetchWeaponry', async (lobbyId: string, ThunkAPI) => {
    return await APIService.getCharacterWeaponry(lobbyId, (ThunkAPI.getState() as RootState).character.descriptor)
})

export const fetchCharacterSpellbook = createAsyncThunk(
    'character/fetchSpellbook',
    async (lobbyId: string, ThunkAPI) => {
        return await APIService.getCharacterSpellbook(lobbyId, (ThunkAPI.getState() as RootState).character.descriptor)
    }
)

export const fetchCharacterStatusEffects = createAsyncThunk(
    'character/fetchStatusEffects',
    async (lobbyId: string, ThunkAPI) => {
        return await APIService.getCharacterStatusEffects(
            lobbyId,
            (ThunkAPI.getState() as RootState).character.descriptor
        )
    }
)

export const fetchCharacterAttributes = createAsyncThunk(
    'character/fetchAttributes',
    async (lobbyId: string, ThunkAPI) => {
        return await APIService.getCharacterAttributes(lobbyId, (ThunkAPI.getState() as RootState).character.descriptor)
    }
)

const setFetchedData = (
    state: CharacterState,
    action: {
        fetchType: 'inventory' | 'spells' | 'statusEffects' | 'attributes' | 'weaponry'
        loadingType: LoadingState
        data?:
            | Array<ItemInfo>
            | Array<WeaponInfo>
            | Array<StatusEffectInfo>
            | AttributeInfo
            | {
                  spellBook: Array<SpellInfo>
                  spellLayout: {
                      layout: Array<string>
                      conflicts: unknown
                  }
              }
    }
) => {
    return {
        ...state,
        fetched: action.data
            ? {
                  ...state.fetched,
                  [action.fetchType]: action.data,
              }
            : { ...state.fetched },
        loading: {
            ...state.loading,
            [action.fetchType]: action.loadingType,
        },
    }
}

const CharacterSlice = createSlice({
    name: 'character',
    initialState,
    reducers: {
        setDescriptor: (state, action: PayloadAction<string>) => {
            return { ...state, descriptor: action.payload }
        },
        resetCharacterFeatures: (state) => {
            return {
                ...state,
                fetched: initialState.fetched,
                loading: initialState.loading,
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCharacterInventory.fulfilled, (state, action) => {
            return setFetchedData(state, {
                fetchType: 'inventory',
                loadingType: 'fulfilled',
                data: action.payload.inventory,
            })
        })
        builder.addCase(fetchCharacterWeaponry.fulfilled, (state, action) => {
            return setFetchedData(state, {
                fetchType: 'weaponry',
                loadingType: 'fulfilled',
                data: action.payload.weaponry,
            })
        })
        builder.addCase(fetchCharacterSpellbook.fulfilled, (state, action) => {
            return setFetchedData(state, {
                fetchType: 'spells',
                loadingType: 'fulfilled',
                data: action.payload.spells,
            })
        })
        builder.addCase(fetchCharacterStatusEffects.fulfilled, (state, action) => {
            return setFetchedData(state, {
                fetchType: 'statusEffects',
                loadingType: 'fulfilled',
                data: action.payload.statusEffects,
            })
        })
        builder.addCase(fetchCharacterAttributes.fulfilled, (state, action) => {
            return setFetchedData(state, {
                fetchType: 'attributes',
                loadingType: 'fulfilled',
                data: action.payload.attributes,
            })
        })
        builder.addCase(fetchCharacterInventory.rejected, (state) => {
            return setFetchedData(state, {
                fetchType: 'inventory',
                loadingType: 'rejected',
            })
        })
        builder.addCase(fetchCharacterWeaponry.rejected, (state) => {
            return setFetchedData(state, {
                fetchType: 'weaponry',
                loadingType: 'rejected',
            })
        })
        builder.addCase(fetchCharacterSpellbook.rejected, (state) => {
            return setFetchedData(state, {
                fetchType: 'spells',
                loadingType: 'rejected',
            })
        })
        builder.addCase(fetchCharacterStatusEffects.rejected, (state) => {
            return setFetchedData(state, {
                fetchType: 'statusEffects',
                loadingType: 'rejected',
            })
        })
        builder.addCase(fetchCharacterAttributes.rejected, (state) => {
            return setFetchedData(state, {
                fetchType: 'attributes',
                loadingType: 'rejected',
            })
        })
        builder.addCase(fetchCharacterInventory.pending, (state) => {
            return setFetchedData(state, {
                fetchType: 'inventory',
                loadingType: 'pending',
            })
        })
        builder.addCase(fetchCharacterWeaponry.pending, (state) => {
            return setFetchedData(state, {
                fetchType: 'weaponry',
                loadingType: 'pending',
            })
        })
        builder.addCase(fetchCharacterSpellbook.pending, (state) => {
            return setFetchedData(state, {
                fetchType: 'spells',
                loadingType: 'pending',
            })
        })
        builder.addCase(fetchCharacterStatusEffects.pending, (state) => {
            return setFetchedData(state, {
                fetchType: 'statusEffects',
                loadingType: 'pending',
            })
        })
        builder.addCase(fetchCharacterAttributes.pending, (state) => {
            return setFetchedData(state, {
                fetchType: 'attributes',
                loadingType: 'pending',
            })
        })
    },
})

export default CharacterSlice.reducer

export const { setDescriptor, resetCharacterFeatures } = CharacterSlice.actions

export const selectDescriptor = (state: RootState) => state.character.descriptor
export const selectLoading = (state: RootState) => state.character.loading

type CharacterFeatureSelect<T> = [T, LoadingState]

export const selectInventory = createSelector(
    (state: RootState) => state.character.fetched.inventory,
    (state: RootState) => state.character.loading.inventory,
    (inventory, loading) => [inventory, loading] as CharacterFeatureSelect<Array<ItemInfo>>
)

export const selectWeaponry = createSelector(
    (state: RootState) => state.character.fetched.weaponry,
    (state: RootState) => state.character.loading.weaponry,
    (weaponry, loading) => [weaponry, loading] as CharacterFeatureSelect<Array<WeaponInfo>>
)

export const selectSpells = createSelector(
    (state: RootState) => state.character.fetched.spells,
    (state: RootState) => state.character.loading.spells,
    (spells, loading) =>
        [spells, loading] as CharacterFeatureSelect<{
            spellBook: Array<SpellInfo>
            spellLayout: {
                layout: Array<string>
                conflicts: unknown
            }
        }>
)

export const selectStatusEffects = createSelector(
    (state: RootState) => state.character.fetched.statusEffects,
    (state: RootState) => state.character.loading.statusEffects,
    (statusEffects, loading) => [statusEffects, loading] as CharacterFeatureSelect<Array<StatusEffectInfo>>
)

export const selectAttributes = createSelector(
    (state: RootState) => state.character.fetched.attributes,
    (state: RootState) => state.character.loading.attributes,
    (attributes, loading) => [attributes, loading] as CharacterFeatureSelect<AttributeInfo>
)
