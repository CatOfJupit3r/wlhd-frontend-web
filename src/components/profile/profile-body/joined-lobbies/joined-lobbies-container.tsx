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
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Lobbies</h2>
                <Button size="sm">Join New Lobby</Button>
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
            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1}>
                        <LuChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages}>
                        <LuChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JoinedLobbiesContainer;
