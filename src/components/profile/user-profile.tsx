import { ProfileBody } from '@components/profile/profile-body';
import useMe from '@queries/useMe';
import { FC } from 'react';
import Banner from './banner';

interface iUserProfile {}

const UserProfile: FC<iUserProfile> = () => {
    const { user } = useMe();

    return (
        <div className={'size-full'}>
            <Banner name={user.name} />
            <ProfileBody />
        </div>
    );
};

export default UserProfile;
