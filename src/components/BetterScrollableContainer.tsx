import { Button } from '@components/ui/button'
import { cn } from '@utils'
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'

const BetterScrollableContainer: React.FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [hasOverflow, setHasOverflow] = useState(false)

    useEffect(() => {
        const checkForOverflow = () => {
            if (scrollContainerRef.current) {
                setHasOverflow(scrollContainerRef.current.scrollHeight > scrollContainerRef.current.clientHeight)
            }
        }
        setTimeout(checkForOverflow)
        window.addEventListener('resize', checkForOverflow)
        return () => window.removeEventListener('resize', checkForOverflow)
    }, [])

    const scrollUp = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ top: -400, behavior: 'smooth' })
        }
    }

    const scrollDown = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ top: 400, behavior: 'smooth' })
        }
    }

    return (
        <div
            className={cn(
                'no-visible-scrollbar relative flex h-[50rem] w-40 flex-col gap-4 overflow-y-scroll rounded border-2 p-2',
                className
            )}
            ref={scrollContainerRef}
            {...props}
        >
            {hasOverflow && (
                <Button className={'sticky top-2 z-10 w-full border-2 opacity-100'} onClick={scrollUp}>
                    <IoIosArrowUp />
                </Button>
            )}
            {children}
            {hasOverflow && (
                <Button className={'sticky bottom-2 w-full border-2'} onClick={scrollDown}>
                    <IoIosArrowDown />
                </Button>
            )}
        </div>
    )
}

BetterScrollableContainer.displayName = 'BetterScrollableContainer'

export default BetterScrollableContainer
