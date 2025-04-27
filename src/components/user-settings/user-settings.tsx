import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { FC } from 'react';

import { Navigate } from '@tanstack/react-router';
import { FaUserCog } from 'react-icons/fa';
import { LuArrowLeft, LuBell, LuPalette, LuShield, LuTriangleAlert } from 'react-icons/lu';
import { RiSecurePaymentLine } from 'react-icons/ri';

import AppearanceTab from './appearance-tab';
import DangerZoneTab from './danger-zone-tab';
import MyAccountTab from './my-account-tab';
import NotificationsTab from './notifications-tab';
import PrivacyTab from './privacy-tab';
import SecurityTab from './security-tab';

interface iUserSettings {}

const UserSettings: FC<iUserSettings> = () => {
    return (
        <Tabs className="flex flex-col space-y-8 p-4 lg:flex-row lg:space-x-8 lg:space-y-0" defaultValue={'account'}>
            <TabsList className="h-full w-full flex-col items-start space-y-1 rounded-lg border bg-card p-2 shadow-sm lg:w-64">
                <TabsTrigger value={'go-back'} className={'w-full py-2'}>
                    <LuArrowLeft className="mr-2 h-4 w-4" />
                    Go Back to Profile
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'account'}>
                    <FaUserCog className="mr-2 h-4 w-4" />
                    Account
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'security'}>
                    <LuShield className="mr-2 h-4 w-4" />
                    Security
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'notifications'} disabled>
                    <LuBell className="mr-2 h-4 w-4" />
                    Notifications
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'appearance'} disabled>
                    <LuPalette className="mr-2 h-4 w-4" />
                    Appearance
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'privacy'} disabled>
                    <RiSecurePaymentLine className={'mr-2 h-4 w-4'} />
                    Privacy
                </TabsTrigger>
                <TabsTrigger className={'w-full py-2'} value={'danger'}>
                    <LuTriangleAlert className="mr-2 h-4 w-4" />
                    Danger Zone
                </TabsTrigger>
            </TabsList>

            {/* Content Area */}
            <div className="flex-1">
                <div className="rounded-lg border bg-card shadow-sm">
                    <TabsContent value={'go-back'}>
                        <Navigate to={'/profile'} />
                    </TabsContent>
                    <TabsContent value={'account'}>
                        <MyAccountTab />
                    </TabsContent>
                    <TabsContent value={'security'}>
                        <SecurityTab />
                    </TabsContent>
                    <TabsContent value={'notifications'}>
                        <NotificationsTab />
                    </TabsContent>
                    <TabsContent value={'appearance'}>
                        <AppearanceTab />
                    </TabsContent>
                    <TabsContent value={'privacy'}>
                        <PrivacyTab />
                    </TabsContent>
                    <TabsContent value={'danger'}>
                        <DangerZoneTab />
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    );
};

export default UserSettings;
