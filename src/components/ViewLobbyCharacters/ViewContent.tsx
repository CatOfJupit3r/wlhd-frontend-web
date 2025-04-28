import { useViewCharactersContext } from '@context/ViewCharactersContext';
import { CharacterEditorFlags, CharacterEditorProvider, useCharacterEditor } from '@context/character-editor';
import { CharacterInfoFull } from '@type-defs/game-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { CharacterDisplayInLobby, CharacterDisplayPlaceholder } from '@components/CharacterDisplay';
import CharacterEditor from '@components/CharacterEditor/CharacterEditor';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@components/ui/alert-dialog';
import { Button, MutationButton } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import useDeleteCharacter from '@mutations/view-character/useDeleteCharacter';
import useUpdateCharacter from '@mutations/view-character/useUpdateCharacter';
import useThisLobby from '@queries/useThisLobby';
import GameConverters from '@services/game-converters';
import { cn, EditorHelpers } from '@utils';

const ViewCharacterEditorSettings: CharacterEditorFlags = {
    exclude: {},
    attributes: {
        ignored: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    },
};

const componentClass = 'flex w-full max-w-[52rem] max-[960px]:max-w-full flex-col gap-4 rounded border-2 p-4 h-full';

const SaveCharacterButton = () => {
    const { viewedCharacter: character, descriptor } = useViewCharactersContext();
    const { character: editedCharacter } = useCharacterEditor();
    const { lobby } = useThisLobby();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.edit-character',
    });
    const { updateCharacter, isPending } = useUpdateCharacter();

    return (
        <MutationButton
            className={'w-full'}
            isPending={isPending}
            mutate={() => {
                if (!descriptor) {
                    return;
                }
                const wasCharacterChanged: boolean = JSON.stringify(character) !== JSON.stringify(editedCharacter);
                if (wasCharacterChanged) {
                    // TODO: create omit function to only send changed fields
                    updateCharacter({
                        lobbyId: lobby.lobbyId,
                        descriptor: descriptor as string,
                        character: EditorHelpers.prepareCharacterToClassConversion(editedCharacter),
                    });
                }
            }}
        >
            {t('save')}
        </MutationButton>
    );
};
const CharacterEditorMenu = () => {
    const { viewedCharacter: character } = useViewCharactersContext();

    return (
        <div className={cn(componentClass, 'flex flex-col gap-2')}>
            <CharacterEditorProvider character={character!} flags={ViewCharacterEditorSettings}>
                <div id={'editor-controls'} className={'flex w-full flex-row gap-1'}>
                    <SaveCharacterButton />
                </div>
                <Separator />
                <CharacterEditor className={'w-full border-0'} />
            </CharacterEditorProvider>
        </div>
    );
};

const GmOptionMenu = () => {
    const { lobby } = useThisLobby();
    const { descriptor } = useViewCharactersContext();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.gm-options',
    });
    const { deleteCharacter, isPending } = useDeleteCharacter();

    return (
        <div className={cn(componentClass, 'h-[350px] justify-between')}>
            <div>
                <h2 className={'w-full text-center text-3xl'}>{t('title')}</h2>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        id={'remove-character'}
                        className={'gap-1'}
                        variant={'destructive'}
                        onClick={() => {
                            if (!descriptor || !lobby) {
                                return;
                            }
                        }}
                        disabled={!descriptor || !lobby}
                    >
                        <RiDeleteBin6Line />
                        {t('delete-character')}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={'flex max-w-[30rem] flex-col items-center gap-2 text-center'}>
                    <AlertDialogTitle>{t('confirmation')}</AlertDialogTitle>
                    <AlertDialogDescription className={'font-normal italic'}>{t('details')}</AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant={'ghost'}>
                                <FaXmark className={'mr-1 text-[1rem]'} />
                                {t('cancel')}
                            </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <MutationButton
                                isPending={isPending}
                                mutate={() => {
                                    if (!descriptor || !lobby) {
                                        return;
                                    }
                                    deleteCharacter({
                                        lobbyId: lobby.lobbyId,
                                        descriptor,
                                    });
                                }}
                                disabled={!descriptor || !lobby}
                            >
                                <RiDeleteBin6Line className={'mr-1 text-[1rem] text-white'} />
                                {t('delete')}
                            </MutationButton>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

const LobbyCharacterDisplay = () => {
    const { viewedCharacter } = useViewCharactersContext();
    const [converted, setConverted] = useState<CharacterInfoFull | null>(null);

    useEffect(() => {
        if (!viewedCharacter) {
            setConverted(null);
        } else {
            setConverted(GameConverters.convertCharacterEditableToInfoFull(viewedCharacter));
        }
    }, [viewedCharacter]);

    if (!viewedCharacter) {
        return <CharacterDisplayPlaceholder className={componentClass} />;
    }

    return converted ? (
        <CharacterDisplayInLobby character={converted} className={componentClass} />
    ) : (
        <CharacterDisplayPlaceholder className={componentClass} />
    );
};

const ViewContent = ({ type }: { type: string }) => {
    const { viewedCharacter } = useViewCharactersContext();
    const { lobby } = useThisLobby();

    if (!viewedCharacter) {
        return <CharacterDisplayPlaceholder className={componentClass} />;
    }

    switch (type) {
        case 'display':
            return <LobbyCharacterDisplay />;
        case 'edit':
            return lobby.layout === 'gm' ? (
                <CharacterEditorMenu />
            ) : (
                <CharacterDisplayPlaceholder className={componentClass} />
            );
        case 'gm-options': {
            return lobby.layout === 'gm' ? (
                <GmOptionMenu />
            ) : (
                <CharacterDisplayPlaceholder className={componentClass} />
            );
        }
        default:
            return <CharacterDisplayPlaceholder className={componentClass} />;
    }
};

export default ViewContent;
