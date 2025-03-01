import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { UserInformation } from '@models/APIData';
import useMe from '@queries/useMe';
import APIService from '@services/APIService';
import { cn } from '@utils';
import { LRUCache } from 'lru-cache';
import { HTMLAttributes, useEffect, useState } from 'react';

interface iUserAvatarProps extends HTMLAttributes<HTMLDivElement> {
    handle: UserInformation['handle'] | null;
}

const avatarCache = new LRUCache<string, string>({ max: 25 }); // Cache up to 25 avatars

const UserAvatar = ({ className, handle, ...props }: iUserAvatarProps) => {
    const [currentHandle, setCurrentHandle] = useState<string | null>(handle); // Initialize as null for better handling of loading states
    const [avatar, setAvatar] = useState<string | null>(null); // Initialize as null for better handling of loading states

    useEffect(() => {
        if (!handle || (currentHandle === handle && avatar)) return;
        setCurrentHandle(handle);

        const cached = avatarCache.get(handle);
        if (cached) {
            setAvatar(cached);
            return;
        }

        const fetchAvatar = async () => {
            // Fetch the avatar and cache it
            const fetchedAvatar = await APIService.getUserAvatar(handle);
            avatarCache.set(handle, fetchedAvatar);
            return fetchedAvatar;
        };

        fetchAvatar().then((avatar) => {
            setAvatar(avatar);
        });
    }, [handle]);

    return (
        <Avatar className={cn('border-4 border-white shadow-lg', className)} {...props}>
            {avatar ? (
                <AvatarImage src={avatar} alt={handle ?? 'avatar'} />
            ) : (
                <AvatarFallback>{(handle || '<3').slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
        </Avatar>
    );
};

export const CurrentUserAvatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { user, isLoggedIn } = useMe();

    if (!isLoggedIn) {
        return <UserAvatar className={className} handle={null} {...props} />;
    }

    return <UserAvatar className={className} handle={user.handle} {...props} />;
};

export default UserAvatar;
