import { FC } from 'react';

import UserSettings from '@components/user-settings';

interface iUserSettingsPage {}

const UserSettingsPage: FC<iUserSettingsPage> = () => {
    return <UserSettings />;
};

export default UserSettingsPage;
