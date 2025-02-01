import { cn } from '@utils';
import React from 'react';
import { Link, LinkProps } from 'react-router';

const baseStyles = 'text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200';

interface StyledLinkProps extends LinkProps {
    disabled?: boolean;
}

const StyledLink: React.FC<StyledLinkProps> = ({ className, children, disabled, to, ...props }) => {
    return (
        <Link
            className={cn(baseStyles, disabled ? 'pointer-events-none' : '', className)}
            to={disabled ? '' : to}
            {...props}
        >
            {children}
        </Link>
    );
};

export default StyledLink;
