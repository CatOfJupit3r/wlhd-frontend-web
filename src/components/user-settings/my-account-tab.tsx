import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { FC } from 'react';

interface iMyAccountTab {}

const MyAccountTab: FC<iMyAccountTab> = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">My Account</h2>
            <p className="text-sm text-muted-foreground">Manage your account information and preferences</p>

            <div className="mt-6 space-y-6">
                {/* Profile Picture & Banner */}
                <div className="space-y-4">
                    <h3 className="font-medium">Profile Picture & Banner</h3>

                    {/* Banner */}
                    {/*<div className="space-y-4">*/}
                    {/*    <div className="h-32 w-full overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600">*/}
                    {/*        <div className="h-full w-full bg-black/20"></div>*/}
                    {/*    </div>*/}

                    {/*    <div className="flex flex-wrap gap-3">*/}
                    {/*        <Button size="sm" variant="outline">*/}
                    {/*            Upload Custom Banner*/}
                    {/*        </Button>*/}
                    {/*        <Button size="sm" variant="outline">*/}
                    {/*            Choose from Gallery*/}
                    {/*        </Button>*/}
                    {/*        <Button size="sm" variant="outline">*/}
                    {/*            Reset to Default*/}
                    {/*        </Button>*/}
                    {/*    </div>*/}

                    {/*    <p className="text-xs text-muted-foreground">*/}
                    {/*        Recommended size: 1500x500px. JPG, PNG or GIF. 2MB max size.*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                            <AvatarFallback className="text-2xl">CJ</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button size="sm">Upload New Image</Button>
                            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. 1MB max size.</p>
                        </div>
                    </div>
                </div>
                {/* Profile Information */}
                <div className="space-y-4">
                    <h3 className="font-medium">Profile Information</h3>
                    <div className="space-y-2">
                        <Label htmlFor="display-name">Display Name</Label>
                        <Input id="display-name" defaultValue="Cosmic Explorer" />
                        <p className="text-xs text-muted-foreground">This is your public display name.</p>
                    </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                    <h3 className="font-medium">Contact Information</h3>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" defaultValue="cosmic@jupiter.space" />
                        <p className="text-xs text-muted-foreground">We'll never share your email with anyone else.</p>
                    </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </div>
        </div>
    );
};

export default MyAccountTab;
