import { Card, CardContent, CardHeader } from '@components/ui/card';
import useMyCharacters from '@queries/profile/use-my-characters';
import { FC } from 'react';
import CharacterCard from './character-card';

interface iCharacters {}

const Characters: FC<iCharacters> = () => {
    const { characters } = useMyCharacters();

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                    <div className="text-lg font-medium">My Characters</div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    {characters.map((character) => (
                        <CharacterCard character={character} key={character.descriptor} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Characters;
