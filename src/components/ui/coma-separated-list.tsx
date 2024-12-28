import { Fragment, ReactNode } from 'react'

interface iCommaSeparatedListProps<T> {
    items: T[]
    renderItem: (item: T) => ReactNode
    emptyMessage: string
    pointAtEnd?: boolean
    className?: string
}

const CommaSeparatedList = <T,>({
    items,
    renderItem,
    className,
    emptyMessage = 'No items',
    pointAtEnd = false,
}: iCommaSeparatedListProps<T>) => {
    if (!items || items.length === 0) {
        return <p className={className}>{emptyMessage}</p>
    }

    return (
        <p className={className}>
            {items.map((item, index) => (
                <Fragment key={index}>
                    {index > 0 && <span className="mr-1">,</span>}
                    {renderItem(item)}
                    {index === items.length - 1 && pointAtEnd && <span>.</span>}
                </Fragment>
            ))}
        </p>
    )
}

export default CommaSeparatedList
