import { FC } from 'react';
import ProfileBio from './profile-bio';
import ShortStats from './short-stats';

interface iBasicUserInfo {}

const BasicUserInfo: FC<iBasicUserInfo> = () => {
    return (
        <>
            <ProfileBio />
            <ShortStats />
        </>
    );
};

export default BasicUserInfo;
