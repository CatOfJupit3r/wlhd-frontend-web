import { Button } from '@components/ui/button';
import { Separator } from '@components/ui/separator';
import { FC } from 'react';

interface iAppearanceTab {}

const AppearanceTab: FC<iAppearanceTab> = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Customize how WLHD looks for you</p>

            <div className="mt-6 space-y-6">
                {/* Theme */}
                <div className="space-y-4">
                    <h3 className="font-medium">Theme</h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="overflow-hidden rounded-lg border-2 border-primary p-2">
                            <div className="space-y-2">
                                <div className="h-10 rounded bg-slate-950"></div>
                                <div className="h-40 rounded bg-slate-900"></div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Dark</div>
                        </div>

                        <div className="overflow-hidden rounded-lg border-2 border-muted p-2">
                            <div className="space-y-2">
                                <div className="h-10 rounded bg-white"></div>
                                <div className="h-40 rounded bg-slate-100"></div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">Light</div>
                        </div>

                        <div className="overflow-hidden rounded-lg border-2 border-muted p-2">
                            <div className="space-y-2">
                                <div className="h-10 rounded bg-slate-950"></div>
                                <div className="h-40 rounded-t bg-slate-900"></div>
                                <div className="h-0 rounded-b bg-white"></div>
                            </div>
                            <div className="mt-2 text-center text-sm font-medium">System</div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Accent Color */}
                <div className="space-y-4">
                    <h3 className="font-medium">Accent Color</h3>

                    <div className="flex flex-wrap gap-3">
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-purple-600 ring-2 ring-offset-2"></div>
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-indigo-600"></div>
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-blue-600"></div>
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-emerald-600"></div>
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-rose-600"></div>
                        <div className="h-8 w-8 cursor-pointer rounded-full bg-amber-600"></div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                </div>
            </div>
        </div>
    );
};

export default AppearanceTab;
