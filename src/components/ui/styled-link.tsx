import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

const baseStyles = 'text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200'

const StyledLink: React.FC<LinkProps> = ({ className, children, ...props }) => {
    return (
        <Link className={twMerge(baseStyles, className)} {...props}>
            {children}
        </Link>
    )
}

export default StyledLink
