import { useCallback } from 'react'
import { Input } from '@components/ui/input'
import { useTranslation } from 'react-i18next'
import { capitalizeFirstLetter } from '@utils'
import { useCharacterEditorContext } from '@components/ContextProviders/CharacterEditorProvider'

const AttributesEditor = () => {
    const { character, updateCharacter, flags } = useCharacterEditorContext()
    const { attributes: attributesFlags } = flags
    const { t } = useTranslation()

    const setAttribute = useCallback(
        (attribute: string, value: string) => {
            updateCharacter({
                ...character,
                attributes: {
                    ...character.attributes,
                    [attribute]: value,
                },
            })
        },
        [character, updateCharacter]
    )

    return (
        <div className={'flex flex-col gap-2 border-2 p-2 text-t-small'}>
            {Object.entries(character.attributes)
                .map(([attribute, value]) => {
                    if (attributesFlags?.ignored?.includes(attribute)) return
                    return (
                        <div key={attribute} className={'flex items-center justify-between'} id={'changeable'}>
                            <p className={'w-full max-w-[70%] break-words'}>{capitalizeFirstLetter(t(attribute))}</p>
                            <Input
                                type={'number'}
                                value={parseInt(value)}
                                className={'w-[10ch] text-right'}
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        setAttribute(attribute, '0')
                                    } else if (
                                        !isNaN(parseInt(e.target.value)) &&
                                        parseInt(e.target.value) >= 0 &&
                                        parseInt(e.target.value) <= 99999
                                    ) {
                                        setAttribute(attribute, e.target.value)
                                    }
                                }}
                                disabled={attributesFlags?.nonEditable?.includes(attribute)}
                            />
                        </div>
                    )
                })}
        </div>
    )
}

export default AttributesEditor
