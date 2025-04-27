import { FC } from 'react';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Skeleton } from '@components/ui/skeleton';

interface iPseudoLobbyInfo {}

const PseudoLobbyInfo: FC<iPseudoLobbyInfo> = () => {
    return (
        <div className="container mx-auto space-y-6 p-4">
            <Skeleton className="h-10 w-96" /> {/* Lobby name */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Skeleton className="mr-2 size-8" />
                            <Skeleton className="h-8 w-64" /> {/* Players */}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] space-y-4">
                            {/* Generate 5 player skeletons */}
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" /> {/* Player name */}
                                        <Skeleton className="h-3 w-24" /> {/* Character name */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Combats Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center">
                            <Skeleton className="mr-2 size-8" />
                            <Skeleton className="h-8 w-64" /> {/* Players */}
                        </CardTitle>
                        <Button variant="outline" size="sm" disabled>
                            <Skeleton className="h-5 w-24" /> {/* New Combat */}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] space-y-6">
                            {/* Generate 2 combat skeletons */}
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <div className={'flex flex-row items-center gap-2'}>
                                        <Skeleton className="size-7 rounded-full" /> {/* Combat status */}
                                        <Skeleton className="h-7 w-32" /> {/* Combat name */}
                                        <Skeleton className="size-7 rounded-sm" /> {/* Players in combat */}
                                        <Button variant="outline" size="sm" disabled>
                                            <Skeleton className="h-5 w-24" /> {/* Join */}
                                        </Button>
                                    </div>
                                    <Skeleton className="h-4 w-64" /> {/* Misc */}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Characters Card */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                        <Skeleton className="mr-2 size-8" />
                        <Skeleton className="h-8 w-96" /> {/* Players */}
                    </CardTitle>
                    <Button variant="outline" disabled>
                        <Skeleton className="h-5 w-24" /> {/* View Characters */}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="grid h-[200px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2 rounded border p-4">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-12 w-12 rounded" /> {/* Character icon */}
                                    <div className="flex-1">
                                        <Skeleton className="mb-2 h-4 w-32" /> {/* Character name */}
                                        <Skeleton className="h-3 w-full" /> {/* Description */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PseudoLobbyInfo;
