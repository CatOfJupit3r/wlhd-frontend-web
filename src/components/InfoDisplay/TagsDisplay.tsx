import React, { FC, ReactNode } from 'react'
import { GameTags } from '@models/CombatEditorModels'
import { FaTags } from 'react-icons/fa'
import { Badge, BadgeVariants } from '@components/ui/badge'
import { PrefixCollection } from '@utils/gameDisplayTools'
import { useTranslation } from 'react-i18next'

interface iTag {
    tag: string
    children?: ReactNode
    badgeVariant?: BadgeVariants
    className?: string
}

export const IndividualTagDisplay: FC<iTag> = ({ tag, children, badgeVariant, className }) => {
    const { t } = useTranslation()
    return (
        <Badge variant={badgeVariant ?? 'outline'} className={className}>
            <p>{t(PrefixCollection.tags(tag))}</p>
            {children}
        </Badge>
    )
}

const TagsDisplay: FC<{ tags: GameTags }> = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return null
    }
    return (
        <div className={'flex flex-row gap-1 text-t-smaller flex-wrap w-full'}>
            <FaTags className={'text-t-big'}/>
            {
                tags.map((tag, index) => {
                    return (
                        <IndividualTagDisplay key={index} tag={tag} badgeVariant={'secondary'} />
                    )
                })
            }
        </div>
    )
}

export default TagsDisplay