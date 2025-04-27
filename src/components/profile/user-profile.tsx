import { FC } from 'react';

import { ProfileBody } from '@components/profile/profile-body';
import useMeExtra from '@queries/use-me-extra';
import useMe from '@queries/useMe';

import Banner from './banner';

interface iUserProfile {}

const UserProfile: FC<iUserProfile> = () => {
    const { user } = useMe();
    const { meExtra } = useMeExtra();

    return (
        <div className={'size-full'}>
            <Banner name={user.name} colors={meExtra.colors} />
            <ProfileBody />
        </div>
    );
};

export default UserProfile;
