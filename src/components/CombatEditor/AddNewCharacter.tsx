import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import GameAsset from '@components/GameAsset';
import { HTMLIconFactoryProps, IconComponentType } from '@components/icons/icon_factory';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { Combobox } from '@components/ui/combobox';
import { Label } from '@components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select';
import { CONTROLLED_BY_GAME_LOGIC, CONTROLLED_BY_PLAYER, useCombatEditorContext } from '@context/CombatEditorContext';
import { useDataContext } from '@context/GameDataProvider';
import { ControlledBy } from '@models/EditorConversion';
import useCoordinatorCharacter from '@queries/useCoordinatorCharacter';
import useThisLobby from '@queries/useThisLobby';
import { SUPPORTED_DLCs } from 'config';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddNewCharacterDialogContent = ({ clickedSquare }: { clickedSquare: string | null }) => {
    const [dlc, setDlc] = useState<string>('');
    const [descriptor, setDescriptor] = useState<string>('');
    const { characters, fetchAndSetCharacters } = useDataContext();
    const { lobby } = useThisLobby();
    const { character: characterFromCoordinator, isPending } = useCoordinatorCharacter(lobby.lobbyId, descriptor);
    const { t } = useTranslation();
    const { addCharacter } = useCombatEditorContext();

    useEffect(() => {
        if (dlc && (characters === null || characters?.[dlc] === undefined)) {
            if (dlc !== 'coordinator') {
                fetchAndSetCharacters(dlc).catch(console.error);
            }
        }
    }, [dlc, characters]);

    return (
        <AlertDialogContent className={'max-w-3xl'}>
            <AlertDialogHeader>
                <AlertDialogTitle>Add new character</AlertDialogTitle>
                <AlertDialogDescription>
                    Choose DLC and descriptor of the character you want to add to square {clickedSquare}
                </AlertDialogDescription>
                <div id={'inputs'} className={'flex w-full flex-row'}>
                    <div className={'w-full'}>
                        <Label>DLC</Label>
                        <Select
                            onValueChange={(value) => {
                                setDlc(value);
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
                                    ? Object.entries(characters?.[dlc] ?? {}).map(([descriptor, character]) => ({
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
                                setDescriptor(e);
                            }}
                        />
                    </div>
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Or maybe don't...</AlertDialogCancel>
                <AlertDialogAction
                    disabled={
                        !dlc ||
                        isPending ||
                        !descriptor ||
                        (dlc !== 'coordinator' &&
                            !characters?.[dlc]?.[descriptor] &&
                            dlc === 'coordinator' &&
                            !lobby.characters?.find((character) => character.descriptor === descriptor))
                    }
                    onClick={() => {
                        if (!clickedSquare) {
                            return;
                        }
                        if (dlc !== 'coordinator') {
                            const character = characters?.[dlc]?.[descriptor];
                            if (character) {
                                addCharacter(clickedSquare, character, `${dlc}:${descriptor}`);
                            } else {
                                fetchAndSetCharacters(dlc).then((fetched) => {
                                    const character = fetched[descriptor];
                                    if (character) {
                                        addCharacter(clickedSquare, character, `${dlc}:${descriptor}`);
                                    }
                                });
                            }
                        } else {
                            const player = lobby.players.find((player) =>
                                player.characters.some(([playerDescriptor]) => playerDescriptor === descriptor),
                            );
                            const controlled: ControlledBy = player
                                ? CONTROLLED_BY_PLAYER(player.userId)
                                : CONTROLLED_BY_GAME_LOGIC;

                            if (characterFromCoordinator) {
                                addCharacter(
                                    clickedSquare,
                                    characterFromCoordinator,
                                    `${dlc}:${descriptor}`,
                                    controlled,
                                );
                            }
                        }
                    }}
                >
                    Add
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
};

export const AddNewCharacter = ({ clickedSquare }: { clickedSquare: string | null }) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger className={'w-full'} asChild>
                <div className={'relative w-full cursor-pointer'}>
                    <CharacterDisplayPlaceholder className={'flex flex-col gap-4 rounded border-2 p-4 opacity-60'} />
                    <p className={'absolute top-[30%] flex w-full flex-col p-4 text-center text-2xl'}>
                        <span>
                            Seems like there is <strong>no character on square {clickedSquare}</strong>...
                        </span>
                        <span>
                            <strong>Click</strong> here to <strong>add</strong> new one!
                        </span>
                    </p>
                </div>
            </AlertDialogTrigger>
            <AddNewCharacterDialogContent clickedSquare={clickedSquare} />
        </AlertDialog>
    );
};
