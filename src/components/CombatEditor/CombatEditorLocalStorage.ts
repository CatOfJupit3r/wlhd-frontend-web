import { CombatEditorSaveType } from '@context/CombatEditorContext'

interface SavedPreset {
    nickName: string
    lobbyID: string
    data: CombatEditorSaveType
}

type SavedPresetExtracted = SavedPreset & { presetID: string }

interface CombatEditorLocalStorage {
    lastUsed: string | null
    battlefields: {
        [key: string]: SavedPreset
    }
}

const LOCAL_STORAGE_KEY = 'combat-editor'

const createLocalStorage = (): CombatEditorLocalStorage => ({
    lastUsed: null,
    battlefields: {},
})

export const verifyCombatEditorLocalStorage = () => {
    const localStorage = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!localStorage) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(createLocalStorage()))
    }
}

export const removeCombatEditorLocalStorage = (battlefieldID: string) => {
    const parsedLocalStorage = getCombatEditorLocalStorage()
    if (!parsedLocalStorage) {
        return
    }
    delete parsedLocalStorage.battlefields[battlefieldID]
    if (parsedLocalStorage.lastUsed === battlefieldID) {
        parsedLocalStorage.lastUsed = null
    }
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedLocalStorage))
}

const getCombatEditorLocalStorage = (): CombatEditorLocalStorage | null => {
    const localStorage = window.localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!localStorage) {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(createLocalStorage()))
        return null
    }
    let parsedLocalStorage: CombatEditorLocalStorage
    try {
        parsedLocalStorage = JSON.parse(localStorage)
    } catch (e) {
        console.log('Local storage is corrupted', e)
        console.log('Input:', localStorage)

        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(createLocalStorage()))
        return null
    }
    return parsedLocalStorage
}

export const getLastUsedCombatEditorPreset = (lobbyID: string): SavedPresetExtracted | null => {
    const parsedLocalStorage = getCombatEditorLocalStorage()
    if (!parsedLocalStorage) {
        return null
    }
    const { lastUsed: lastUsedID, battlefields } = parsedLocalStorage
    if (!lastUsedID) {
        return null
    } else if (!battlefields[lastUsedID]) {
        return null
    }
    if (battlefields[lastUsedID].lobbyID !== lobbyID) {
        removeCombatEditorLocalStorage(lastUsedID)
        return null
    }
    return battlefields[lastUsedID] ? { ...battlefields[lastUsedID], presetID: lastUsedID } : null
}

export const saveCombatEditorPreset = (nickName: string, data: SavedPreset['data'], lobbyID: string) => {
    const parsedLocalStorage = getCombatEditorLocalStorage()
    if (!parsedLocalStorage) {
        return
    }
    const { battlefields } = parsedLocalStorage
    const newID = Object.keys(battlefields).length.toString()
    battlefields[newID] = {
        nickName,
        data,
        lobbyID,
    }
    parsedLocalStorage.lastUsed = newID
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedLocalStorage))
}

export { createLocalStorage }
