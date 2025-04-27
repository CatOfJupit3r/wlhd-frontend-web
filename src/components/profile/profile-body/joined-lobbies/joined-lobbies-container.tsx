import JoinNewLobby from '@components/profile/profile-body/joined-lobbies/join-new-lobby';
import { Button } from '@components/ui/button';
import { usePagination } from '@hooks/use-pagination';
import useJoinedLobbies from '@queries/profile/useJoinedLobbies';
import { FC } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import JoinedLobbyCard from './joined-lobby-card';

interface iJoinedLobbiesContainer {}

const JoinedLobbiesContainer: FC<iJoinedLobbiesContainer> = () => {
    const { joined } = useJoinedLobbies();
    const { currentPage, totalPages, prevPage, nextPage } = usePagination(joined);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 pt-4 text-white">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={prevPage}
                        disabled={currentPage === 1 || totalPages === 1}
                    >
                        <LuChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={nextPage}
                        disabled={currentPage === totalPages || totalPages === 1}
                    >
                        <LuChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <JoinNewLobby>
                    <Button size="sm" variant={'outline'}>
                        Join New Lobby
                    </Button>
                </JoinNewLobby>
            </div>
            {/* Lobby Cards with Pagination */}
            <div className="grid gap-4 sm:grid-cols-2">
                {joined.map((lobby) => (
                    <JoinedLobbyCard
                        name={lobby.name}
                        isGm={lobby.isGm}
                        _id={lobby._id}
                        needsApproval={lobby.needsApproval}
                        characters={lobby.characters}
                    />
                ))}
            </div>
        </div>
    );
};

export default JoinedLobbiesContainer;
