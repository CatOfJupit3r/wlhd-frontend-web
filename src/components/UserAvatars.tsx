import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import useMe from '@queries/useMe';
import APIService from '@services/APIService';
import { cn } from '@utils';
import { LRUCache } from 'lru-cache';
import { HTMLAttributes, useMemo } from 'react';

interface iUserAvatarProps extends HTMLAttributes<HTMLDivElement> {
    username: string | null;
}

const avatarCache = new LRUCache<string, string>({ max: 25 }); // Cache up to 25 avatars

const UserAvatar = ({ className, username, ...props }: iUserAvatarProps) => {
    const avatar = useMemo(() => {
        if (!username) return null;
        const cached = avatarCache.get(username);
        if (cached) return cached;
        const url = APIService.getUserAvatarEndpoint(username);
        avatarCache.set(username, url);
        return url;
    }, [username]);

    return (
        <Avatar className={cn('border-4 border-white shadow-lg', className)} {...props}>
            {avatar ? <AvatarImage src={avatar} alt={username ?? 'avatar'} /> : null}
            <AvatarFallback>{(username ?? '<3').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};

export const CurrentUserAvatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { user, isLoggedIn } = useMe();

    if (!isLoggedIn) {
        return <UserAvatar className={className} username={null} {...props} />;
    }

    return <UserAvatar className={className} username={user.username} {...props} />;
};

export default UserAvatar;
