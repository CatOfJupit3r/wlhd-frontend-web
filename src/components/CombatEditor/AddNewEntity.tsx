import {
    CONTROLLED_BY_GAME_LOGIC,
    CONTROLLED_BY_PLAYER,
    useCombatEditorContext,
} from '@context/CombatEditorContext'
import { useCoordinatorEntitiesContext } from '@context/CoordinatorEntitiesProvider'
import { useDataContext } from '@context/GameDataProvider'
import GameAsset from '@components/GameAsset'
import { HTMLIconFactoryProps, IconComponentType } from '@components/icons/icon_factory'
import { Button } from '@components/ui/button'
import { Combobox } from '@components/ui/combobox'
import { Label } from '@components/ui/label'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'
import { ControlledBy } from '@models/EditorConversion'
import { selectClickedSquare } from '@redux/slices/battlefieldSlice'
import { selectLobbyInfo } from '@redux/slices/lobbySlice'
import { SUPPORTED_DLCs } from 'config'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

export const AddNewEntity = () => {
    const [dlc, setDlc] = useState<string>('')
    const [descriptor, setDescriptor] = useState<string>('')
    const { entities, fetchAndSetEntities } = useDataContext()
    const { characters, fetchCharacter } = useCoordinatorEntitiesContext()
    const { t } = useTranslation()
    const clickedSquare = useSelector(selectClickedSquare)
    const lobby = useSelector(selectLobbyInfo)
    const { addCharacter } = useCombatEditorContext()

    useEffect(() => {
        if (dlc && (entities === null || entities?.[dlc] === undefined)) {
            if (dlc !== 'coordinator') {
                fetchAndSetEntities(dlc).catch(console.error)
            }
        }
    }, [dlc, entities])

    return (
        <div className={'flex w-full flex-col'}>
            <div id={'inputs'} className={'flex w-full flex-row'}>
                <div className={'w-full'}>
                    <Label>DLC</Label>
                    <Select
                        onValueChange={(value) => {
                            setDlc(value)
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={'DLC'} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>DLC</SelectLabel>
                                {SUPPORTED_DLCs.map(({ title, descriptor }) => (
                                    <SelectItem key={descriptor} value={descriptor}>
                                        {title}
                                    </SelectItem>
                                ))}
                                <SelectItem value={'coordinator'}>Custom</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className={'w-full'}>
                    <Label>Descriptor</Label>
                    <Combobox
                        items={[
                            ...(dlc !== 'coordinator'
                                ? Object.entries(entities?.[dlc] ?? {}).map(([descriptor, character]) => ({
                                      value: descriptor,
                                      label: t(character.decorations.name),
                                      icon: ((props: HTMLIconFactoryProps) => (
                                          <GameAsset src={character.decorations.sprite} {...props} />
                                      )) as IconComponentType,
                                  }))
                                : Object.values(lobby.characters ?? {}).map((character) => ({
                                      value: character.descriptor,
                                      label: character.decorations.name,
                                      icon: ((props: HTMLIconFactoryProps) => (
                                          <GameAsset src={character.decorations.sprite} {...props} />
                                      )) as IconComponentType,
                                  }))),
                        ]}
                        includeSearch={true}
                        value={descriptor}
                        onChange={(e) => {
                            setDescriptor(e)
                        }}
                    />
                </div>
            </div>
            <Button
                onClick={() => {
                    if (!clickedSquare) {
                        return
                    }
                    if (dlc !== 'coordinator') {
                        const entity = entities?.[dlc]?.[descriptor]
                        if (entity) {
                            addCharacter(clickedSquare, entity, `${dlc}:${descriptor}`)
                        } else {
                            fetchAndSetEntities(dlc).then((fetched) => {
                                const entity = fetched[descriptor]
                                if (entity) {
                                    addCharacter(clickedSquare, entity, `${dlc}:${descriptor}`)
                                }
                            })
                        }
                    } else {
                        const entity = characters?.[descriptor]
                        const player = lobby.players.find((player) => player.characters.includes(descriptor))
                        const controlled: ControlledBy = player
                            ? CONTROLLED_BY_PLAYER(player.userId)
                            : CONTROLLED_BY_GAME_LOGIC

                        if (entity) {
                            addCharacter(clickedSquare, entity, `${dlc}:${descriptor}`, controlled)
                        } else {
                            const TryFetchCharacter = async () => {
                                const character = await fetchCharacter(lobby.lobbyId, descriptor, true)
                                if (character) {
                                    addCharacter(clickedSquare, character, `${dlc}:${descriptor}`, controlled)
                                }
                            }
                            TryFetchCharacter().then()
                        }
                    }
                }}
            >
                Add
            </Button>
        </div>
    )
}
