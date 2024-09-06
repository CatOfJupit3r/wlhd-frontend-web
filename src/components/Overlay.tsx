import { cn } from '@utils'
import React from 'react'

const Overlay = ({ children, className }: { className?: string; children?: React.ReactNode }) => {
    return (
        <div
            id={'overlay-screen'}
            className={cn(
                'fixed inset-0 z-50 box-border flex size-full items-center justify-center overflow-auto',
                'whitespace-pre-wrap bg-black bg-opacity-90 px-8 pb-16 pt-8 leading-snug text-white',
                className
            )}
        >
            {children}
        </div>
    )
}

export default Overlay
