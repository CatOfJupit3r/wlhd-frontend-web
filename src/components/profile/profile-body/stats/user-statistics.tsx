import { FC } from 'react';
import { LuConstruction } from 'react-icons/lu';

const UserStatistics: FC = () => {
    return (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
            <h3 className="mb-4 text-lg font-medium">Detailed Statistics</h3>
            <div className="flex items-center justify-center gap-2">
                <LuConstruction className="h-12 w-12" />
                <p className="text-3xl font-medium">Under construction</p>
            </div>
        </div>
    );
};

export default UserStatistics;
