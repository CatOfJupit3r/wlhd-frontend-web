import UserSettings from '@components/user-settings';
import { FC } from 'react';

interface iUserSettingsPage {}

const UserSettingsPage: FC<iUserSettingsPage> = () => {
    return <UserSettings />;
};

export default UserSettingsPage;
