import React from 'react'

const Overlay = ({ row, children }: { row?: boolean; children?: React.ReactNode }) => {
    return (
        <div
            id={'overlay-screen'}
            className={
                'fixed inset-0 box-border flex h-full w-full items-center ' +
                'justify-center overflow-auto whitespace-pre-wrap bg-black ' +
                'bg-opacity-90 px-8 pb-16 pt-8 text-lg leading-snug text-white font-bold z-50'
            }
        >
            <div className={`flex items-center justify-center ${row ? 'flex-row' : 'flex-col'} gap-4`}>{children}</div>
        </div>
    )
}

export default Overlay
