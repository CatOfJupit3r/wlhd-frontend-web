import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import useMe from '@queries/useMe';
import APIService from '@services/APIService';
import { cn } from '@utils';
import { LRUCache } from 'lru-cache';
import { HTMLAttributes, useMemo } from 'react';

interface iUserAvatarProps extends HTMLAttributes<HTMLDivElement> {
    userId: string | null;
}

const avatarCache = new LRUCache<string, string>({ max: 25 }); // Cache up to 25 avatars

const UserAvatar = ({ className, userId, ...props }: iUserAvatarProps) => {
    const avatar = useMemo(() => {
        if (!userId) return null;
        const cached = avatarCache.get(userId);
        if (cached) return cached;
        const url = APIService.getUserAvatarEndpoint(userId);
        avatarCache.set(userId, url);
        return url;
    }, [userId]);

    return (
        <Avatar className={cn('border-4 border-white shadow-lg', className)} {...props}>
            {avatar ? <AvatarImage src={avatar} alt={userId ?? 'avatar'} /> : null}
            <AvatarFallback>{(userId ?? '<3').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
};

export const CurrentUserAvatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { user, isLoggedIn } = useMe();

    if (!isLoggedIn) {
        return <UserAvatar className={className} userId={null} {...props} />;
    }

    return <UserAvatar className={className} userId={user.id} {...props} />;
};

export default UserAvatar;
