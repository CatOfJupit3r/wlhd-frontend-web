import { Button } from '@components/ui/button';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { Switch } from '@components/ui/switch';
import { FC } from 'react';

interface iNotificationsTab {}

const NotificationsTab: FC<iNotificationsTab> = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Notifications</h2>
            <p className="text-sm text-muted-foreground">Manage how you receive notifications</p>

            <div className="mt-6 space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4">
                    <h3 className="font-medium">Email Notifications</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-messages">Messages</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive email notifications when you get a new message
                                </p>
                            </div>
                            <Switch id="email-messages" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-lobby">Lobby Invites</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive email notifications for new lobby invitations
                                </p>
                            </div>
                            <Switch id="email-lobby" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-updates">Platform Updates</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive emails about new features and updates
                                </p>
                            </div>
                            <Switch id="email-updates" />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-marketing">Marketing</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive emails about promotions and events
                                </p>
                            </div>
                            <Switch id="email-marketing" />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Push Notifications */}
                <div className="space-y-4">
                    <h3 className="font-medium">Push Notifications</h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-all">Enable Push Notifications</Label>
                                <p className="text-xs text-muted-foreground">
                                    Master toggle for all push notifications
                                </p>
                            </div>
                            <Switch id="push-all" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-messages">Messages</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive push notifications for new messages
                                </p>
                            </div>
                            <Switch id="push-messages" defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push-lobby">Lobby Activity</Label>
                                <p className="text-xs text-muted-foreground">
                                    Receive push notifications for lobby updates
                                </p>
                            </div>
                            <Switch id="push-lobby" defaultChecked />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>Save Preferences</Button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsTab;
