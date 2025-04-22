import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { FC, useState } from 'react';
import { FaDiscord } from 'react-icons/fa';
import { LuEye, LuEyeOff } from 'react-icons/lu';

interface iSecurityTab {}

const SecurityTab: FC<iSecurityTab> = () => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Security</h2>
            <p className="text-sm text-muted-foreground">Manage your account security and linked accounts</p>

            <div className="mt-6 space-y-6">
                {/* Password */}
                <div className="space-y-4">
                    <h3 className="font-medium">Change Password</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="current-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <LuEyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                        <LuEye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" placeholder="••••••••" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                            <Input id="confirm-password" type="password" placeholder="••••••••" />
                        </div>

                        <Button>Update Password</Button>
                    </div>
                </div>

                <Separator />

                <Separator />

                {/* Connected Accounts */}
                <div className="space-y-4">
                    <h3 className="font-medium">Connected Accounts</h3>
                    <p className="text-sm text-muted-foreground">
                        Connect your accounts for easier login and enhanced features
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-3">
                                <FaDiscord className="h-5 w-5" />
                                <div>
                                    <p className="font-medium">GitHub</p>
                                    <p className="text-xs text-muted-foreground">Connected as @catOfJupit3r</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                Disconnect
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;
