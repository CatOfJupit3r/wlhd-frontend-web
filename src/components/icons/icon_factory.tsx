import { ImgHTMLAttributes } from 'react'

export type HTMLIconFactoryProps = ImgHTMLAttributes<HTMLImageElement>


const IconFactory = ({
    src,
    alt,
    className,
    ...props
}: HTMLIconFactoryProps) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
            {...props}
        />
    )
}

const createIconComponent = (src: string, alt: string, displayName: string) => {
    const IconComponent = (props: HTMLIconFactoryProps) => (
        <IconFactory src={src} alt={alt} {...props} />
    );
    IconComponent.displayName = displayName;
    return IconComponent;
};

export default createIconComponent;