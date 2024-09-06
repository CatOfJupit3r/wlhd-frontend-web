import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar'
import { selectUserInformation } from '@redux/slices/cosmeticsSlice'
import { cn } from '@utils'
import { HTMLAttributes } from 'react'
import { useSelector } from 'react-redux'

const UserAvatar = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
    const { avatar, handle } = useSelector(selectUserInformation)

    return (
        <Avatar className={cn('border-4 border-white shadow-lg', className)} {...props}>
            <AvatarImage src={avatar || '/placeholder.svg'} alt={handle} />
            <AvatarFallback>{(handle || '<3').slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}

export default UserAvatar
