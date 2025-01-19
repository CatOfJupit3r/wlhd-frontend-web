import { ImgHTMLAttributes, JSX } from 'react'

export type HTMLIconFactoryProps = ImgHTMLAttributes<HTMLImageElement>
export type IconComponentType = (props: HTMLIconFactoryProps) => JSX.Element

const IconFactory = ({ src, alt, className, ...props }: HTMLIconFactoryProps) => {
    if (!src) return null
    return <img src={src} alt={alt} className={className} {...props} />
}

const createIconComponent = (src: string, alt: string, displayName: string): IconComponentType => {
    const IconComponent = (props: HTMLIconFactoryProps) => <IconFactory src={src} alt={alt} {...props} />
    IconComponent.displayName = displayName
    return IconComponent
}

export default createIconComponent
