import React from 'react'
import { Separator } from '@components/ui/separator'
import ComponentEditorsContainer from '@components/CharacterEditor/GameComponentEditors/ComponentEditorsContainer'
import CharacterMainInfoEditor from '@components/CharacterEditor/MainAreaEditors/CharacterMainInfoEditor'

export const DLCs = [
    {
        value: 'builtins',
        label: 'Builtins',
    },
    {
        value: 'nyrzamaer',
        label: 'Nyrzamaer Tales',
    },
]

const CharacterEditor = () => {
    /*

    Editor requires following components:
    - CharacterEditorProvider.tsx
    - GameDataProvider.tsx

    If you don't wrap this component with those providers, it will throw an error.

     */

    return (
        <div className={'relative flex w-[30rem] flex-col gap-4 border-2 p-4 text-left transition-all'}>
            <CharacterMainInfoEditor />
            <Separator className={'mt-4'}/>
            <ComponentEditorsContainer />
        </div>
    )
}

export default CharacterEditor
