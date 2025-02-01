import { CharacterEditorMenus } from '@components/CharacterEditor/CharacterEditorMenus';
import CharacterMainInfoEditor from '@components/CharacterEditor/MainAreaEditors/CharacterMainInfoEditor';
import { Separator } from '@components/ui/separator';
import { cn } from '@utils';

const CharacterEditor = ({ className }: { className?: string }) => {
    /*

    Editor requires following components:
    - CharacterEditorProvider.tsx
    - GameDataProvider.tsx

    If you don't wrap this component with those providers, it will throw an error.

     */

    return (
        <div className={cn('relative flex w-[30rem] flex-col gap-4 border-2 p-4 text-left transition-all', className)}>
            <CharacterMainInfoEditor />
            <Separator className={'mt-4'} />
            <CharacterEditorMenus />
        </div>
    );
};

export default CharacterEditor;
