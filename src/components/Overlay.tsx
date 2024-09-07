import { cn } from '@utils'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface OverlayProps {
    className?: string
    children?: React.ReactNode
}

const Overlay: React.FC<OverlayProps> = ({ children, className }) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="fixed inset-0 z-50"
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="fixed inset-0 bg-black/90"
                />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.1 }}
                            className={cn(
                                'w-full max-w-lg overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl',
                                className
                            )}
                        >
                            {children}
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default Overlay
