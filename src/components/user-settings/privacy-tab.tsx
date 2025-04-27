import { FC } from 'react';

import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { Switch } from '@components/ui/switch';

interface iPrivacyTab {}

const PrivacyTab: FC<iPrivacyTab> = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Privacy</h2>
            <p className="text-sm text-muted-foreground">Manage your privacy settings and data</p>

            <div className="mt-6 space-y-6">
                {/* Profile Visibility */}
                <div className="space-y-4">
                    <h3 className="font-medium">Profile Visibility</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="visibility-profile">Public Profile</Label>
                                <p className="text-xs text-muted-foreground">Allow anyone to view your profile</p>
                            </div>
                            <Switch id="visibility-profile" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="visibility-email">Show Email</Label>
                                <p className="text-xs text-muted-foreground">
                                    Display your email on your public profile
                                </p>
                            </div>
                            <Switch id="visibility-email" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="visibility-activity">Activity Status</Label>
                                <p className="text-xs text-muted-foreground">Show when you're online or last active</p>
                            </div>
                            <Switch id="visibility-activity" defaultChecked />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Data Usage */}
                <div className="space-y-4">
                    <h3 className="font-medium">Data Usage</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="data-analytics">Analytics</Label>
                                <p className="text-xs text-muted-foreground">
                                    Allow us to collect anonymous usage data to improve our service
                                </p>
                            </div>
                            <Switch id="data-analytics" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="data-personalization">Personalization</Label>
                                <p className="text-xs text-muted-foreground">
                                    Allow us to use your data for personalized recommendations
                                </p>
                            </div>
                            <Switch id="data-personalization" defaultChecked />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Data Export */}
                <div className="space-y-4">
                    <h3 className="font-medium">Your Data</h3>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline">Request Data Export</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        We'll prepare a downloadable file with all your personal data. This process may take up to 48
                        hours.
                    </p>
                </div>

                <div className="flex justify-end">
                    <Button>Save Privacy Settings</Button>
                </div>
            </div>
        </div>
    );
};

export default PrivacyTab;
