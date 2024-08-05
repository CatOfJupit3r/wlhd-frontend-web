import React, { useEffect } from 'react'
import { selectActionResult, setActionResult } from '@redux/slices/turnSlice'
import { useSelector } from 'react-redux'
import { useToast } from '@hooks/useToast'
import { useTranslation } from 'react-i18next'

const ResultListener = () => {
    const actionResult = useSelector(selectActionResult)
    const { t } = useTranslation()
    const { toast } = useToast()

    useEffect(() => {
        const { type, details } = actionResult
        if (type === 'pending') {
            return
        } else {
            toast({
                title: 'local:game.action_output',
                description: details ? t(details) || '???' : '???',
                position: 'bottom-left',
                variant: type === 'success' ? 'default' : 'destructive',
            })
            setActionResult({ type: 'pending', details: '' })
        }
    }, [actionResult])

    return <div></div>
}

export default ResultListener
