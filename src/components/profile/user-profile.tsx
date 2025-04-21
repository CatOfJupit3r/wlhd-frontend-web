import { ProfileBody } from '@components/profile/profile-body';
import { FC } from 'react';
import Banner from './banner';

interface iUserProfile {}

const UserProfile: FC<iUserProfile> = () => {
    return (
        <div className={'size-full'}>
            <Banner />
            <ProfileBody />
        </div>
    );
};

export default UserProfile;
