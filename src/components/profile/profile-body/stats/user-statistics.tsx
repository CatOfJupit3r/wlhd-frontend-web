import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { FC } from 'react';

const UserStatistics: FC = () => {
    return (
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow">
            <h3 className="mb-4 text-lg font-medium">Detailed Statistics</h3>

            <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Profile Views</span>
                                <span className="font-medium">3,427</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-2 w-[85%] rounded-full bg-purple-500"></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Post Engagement</span>
                                <span className="font-medium">68%</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-2 w-[68%] rounded-full bg-indigo-500"></div>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm">Average Response</span>
                                <span className="font-medium">4.2 hrs</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                                <div className="h-2 w-[60%] rounded-full bg-violet-500"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Contributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 gap-1">
                            {[...Array(35)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-4 rounded-sm ${
                                        Math.random() > 0.6
                                            ? 'bg-purple-500'
                                            : Math.random() > 0.4
                                              ? 'bg-purple-300'
                                              : Math.random() > 0.7
                                                ? 'bg-purple-200'
                                                : 'bg-slate-200 dark:bg-slate-800'
                                    }`}
                                />
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                            <span>Last 5 Weeks</span>
                            <div className="flex items-center gap-2">
                                <span>Less</span>
                                <div className="flex gap-0.5">
                                    <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-3 w-3 rounded-sm bg-purple-200" />
                                    <div className="h-3 w-3 rounded-sm bg-purple-300" />
                                    <div className="h-3 w-3 rounded-sm bg-purple-500" />
                                </div>
                                <span>More</span>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Projects Completed</span>
                                <span className="font-medium">24</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Code Contributions</span>
                                <span className="font-medium">187</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Longest Streak</span>
                                <span className="font-medium">14 days</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserStatistics;
