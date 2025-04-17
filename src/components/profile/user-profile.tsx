import { FC } from 'react';
import Banner from './banner';

interface iUserProfile {}

const UserProfile: FC<iUserProfile> = () => {
    return (
        <div className={'size-full'}>
            <Banner />
        </div>
    );
};

export default UserProfile;
