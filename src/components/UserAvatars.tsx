import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { CosmeticsState } from '@models/Redux'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import APIService from '@services/APIService'
import { cn } from '@utils'
import { LRUCache } from 'lru-cache'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

interface iUserAvatarProps extends HTMLAttributes<HTMLDivElement> {
    handle: CosmeticsState['user']['handle']
}

const avatarCache = new LRUCache<string, string>({ max: 25 }) // Cache up to 100 avatars

const UserAvatar = ({ className, handle, ...props }: iUserAvatarProps) => {
    const [avatar, setAvatar] = useState<string | null>(null) // Initialize as null for better handling of loading states

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!handle) return
            // Check if the avatar is already in the cache
            const cachedAvatar = avatarCache.get(handle)
            if (cachedAvatar) {
                setAvatar(cachedAvatar)
            } else {
                // Fetch the avatar and cache it
                const fetchedAvatar = await APIService.getUserAvatar(handle)
                avatarCache.set(handle, fetchedAvatar)
                setAvatar(fetchedAvatar)
            }
        }

        fetchAvatar().then()
    }, [handle])

    return (
        <Avatar className={cn('border-4 border-white shadow-lg', className)} {...props}>
            {avatar ? (
                <AvatarImage src={avatar} alt={handle} />
            ) : (
                <AvatarFallback>{(handle || '<3').slice(0, 2).toUpperCase()}</AvatarFallback>
            )}
        </Avatar>
    )
}

export const CurrentUserAvatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { handle } = useSelector(selectUserInformation)

    return <UserAvatar className={className} handle={handle} {...props} />
}

export default UserAvatar
