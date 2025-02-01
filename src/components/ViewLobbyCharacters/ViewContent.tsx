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
import {
    CharacterEditorContextType,
    CharacterEditorProvider,
    useBuildCharacterEditorProps,
} from '@context/CharacterEditorProvider';
import { useViewCharactersContext } from '@context/ViewCharactersContext';
import { CharacterDataEditable } from '@models/CombatEditorModels';
import { CharacterInfoFull } from '@models/GameModels';
import useUpdateCharacter from '@mutations/useUpdateCharacter';
import useThisLobby from '@queries/useThisLobby';
import APIService from '@services/APIService';
import GameConverters from '@services/GameConverters';
import { cn } from '@utils';
import { prepareCharacterToClassConversion } from '@utils/editorPrepareFunction';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ViewCharacterEditorSettings: CharacterEditorContextType['flags'] = {
    exclude: {},
    attributes: {
        ignored: ['builtins:current_health', 'builtins:current_action_points', 'builtins:current_armor'],
    },
};

const componentClass = 'flex w-full max-w-[52rem] max-[960px]:max-w-full flex-col gap-4 rounded border-2 p-4 h-full';

const CharacterEditorMenu = () => {
    const { viewedCharacter: character, descriptor } = useViewCharactersContext();
    const { lobby } = useThisLobby();
    const {
        character: editedCharacter,
        changeEditedCharacter,
        resetCharacter,
    } = useBuildCharacterEditorProps({ ...character } as CharacterDataEditable);
    const { updateCharacter, isPending } = useUpdateCharacter();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.edit-character',
    });

    useEffect(() => {
        if (!character) {
            return;
        }
        changeEditedCharacter({ ...character });
    }, [character]);

    return (
        <div className={cn(componentClass, 'flex flex-col gap-2')}>
            <div id={'editor-controls'} className={'flex w-full flex-row gap-1'}>
                <Button
                    variant={'destructive'}
                    className={'w-full'}
                    onClick={() => {
                        resetCharacter();
                    }}
                >
                    {t('reset')}
                </Button>
                <MutationButton
                    className={'w-full'}
                    isPending={isPending}
                    mutate={() => {
                        if (!descriptor) {
                            return;
                        }
                        const wasCharacterChanged: boolean =
                            JSON.stringify(character) !== JSON.stringify(editedCharacter);
                        if (wasCharacterChanged) {
                            // TODO: create omit function to only send changed fields
                            updateCharacter({
                                lobbyId: lobby.lobbyId,
                                descriptor: descriptor as string,
                                character: prepareCharacterToClassConversion(editedCharacter),
                            });
                        }
                    }}
                >
                    {t('save')}
                </MutationButton>
            </div>
            <Separator />
            <CharacterEditorProvider
                character={editedCharacter}
                setEditedCharacter={changeEditedCharacter}
                flags={ViewCharacterEditorSettings}
            >
                <CharacterEditor className={'w-full border-0'} />
            </CharacterEditorProvider>
        </div>
    );
};

const GmOptionMenu = () => {
    const { lobby, refetch } = useThisLobby();
    const { descriptor } = useViewCharactersContext();
    const { t } = useTranslation('local', {
        keyPrefix: 'character-viewer.gm-options',
    });

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
                            <Button
                                variant={'destructive'}
                                disabled={!descriptor || !lobby}
                                onClick={() => {
                                    if (!descriptor || !lobby) {
                                        return;
                                    }
                                    APIService.deleteCharacter(lobby.lobbyId, descriptor)
                                        .then(() => {
                                            refetch().then();
                                        })
                                        .catch((error) => {
                                            console.error('Error removing character', error);
                                        });
                                }}
                            >
                                <RiDeleteBin6Line className={'mr-1 text-[1rem] text-white'} />
                                {t('delete')}
                            </Button>
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
