import { SUPPORTED_DLCs } from '@configuration';
import { useCombatEditor } from '@context/combat-editor';
import { ControlledBy } from '@type-defs/EditorConversion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import { gameAssetToComboboxIcon } from '@components/GameAsset';
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
import useCoordinatorCharacter from '@queries/useCoordinatorCharacter';
import { useGameCharacterInformation } from '@queries/useGameData';
import { useLoadedCharacters } from '@queries/useLoadedGameData';
import useThisLobby from '@queries/useThisLobby';
import { CONTROLLED_BY_GAME_LOGIC, CONTROLLED_BY_PLAYER } from '@utils';

const AddNewCharacterDialogContent = ({ clickedSquare }: { clickedSquare: string | null }) => {
    const [dlc, setDlc] = useState<string>('');
    const [descriptor, setDescriptor] = useState<string>('');
    const { character } = useGameCharacterInformation(dlc, descriptor, dlc !== 'coordinator');
    const { lobby } = useThisLobby();
    const { characters: charactersFromCoordinator, isSuccess: isSuccessLoaded } = useLoadedCharacters(
        dlc,
        dlc !== 'coordinator',
    );
    const { character: characterFromCoordinator, isSuccess: isSuccessCoordinator } = useCoordinatorCharacter(
        lobby.lobbyId,
        descriptor,
        dlc === 'coordinator',
    );
    const { t } = useTranslation();
    const { addCharacter } = useCombatEditor();

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
                                setDescriptor('');
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
                                    ? Object.entries(charactersFromCoordinator ?? {}).map(
                                          ([descriptor, character]) => ({
                                              value: descriptor,
                                              label: t(character.decorations.name),
                                              icon: gameAssetToComboboxIcon(character),
                                          }),
                                      )
                                    : Object.values(lobby.characters ?? {}).map((character) => ({
                                          value: character.descriptor,
                                          label: character.decorations.name,
                                          icon: gameAssetToComboboxIcon(character),
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
                        !descriptor ||
                        (dlc === 'coordinator'
                            ? !isSuccessCoordinator &&
                              !lobby.characters?.find((character) => character.descriptor === descriptor)
                            : !isSuccessLoaded && !character)
                    }
                    onClick={() => {
                        if (!clickedSquare) {
                            return;
                        }
                        if (dlc !== 'coordinator') {
                            if (character) {
                                console.log('Adding character from preset', character);
                                addCharacter({
                                    square: clickedSquare,
                                    character: character,
                                    descriptor: `${dlc}:${descriptor}`,
                                });
                            }
                        } else {
                            const player = lobby.players.find((player) =>
                                player.characters.some(([playerDescriptor]) => playerDescriptor === descriptor),
                            );
                            const controlled: ControlledBy = player
                                ? CONTROLLED_BY_PLAYER(player.userId)
                                : CONTROLLED_BY_GAME_LOGIC();

                            if (characterFromCoordinator) {
                                console.log('Adding character from coordinator', characterFromCoordinator);
                                addCharacter({
                                    square: clickedSquare,
                                    character: characterFromCoordinator,
                                    descriptor: `${dlc}:${descriptor}`,
                                    control: controlled,
                                });
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
