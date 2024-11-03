import { cn } from '@utils'
import { FC } from 'react'

interface iSpinnerProps {
    type: 'spin' | 'pulse'
    color?: string
    size?: number
    className?: string
}

const Spinner: FC<iSpinnerProps> = ({ type, color, size, className }) => {
    return (
        <div
            className={cn(
                'inline-block',
                type === 'spin' ? '} animate-spinner-border border-solid border-r-transparent' : 'animate-spinner-grow',
                className
            )}
            style={{
                width: `${size || 2}rem`,
                height: `${size || 2}rem`,
                borderRadius: '50%',
                verticalAlign: '-0.125',
                ...(type === 'spin'
                    ? {
                          borderRightColor: 'transparent',
                          borderLeftColor: color || 'black',
                          borderTopColor: color || 'black',
                          borderBottomColor: color || 'black',
                          borderWidth: `${(size || 2) / 5}rem`,
                      }
                    : {
                          backgroundColor: color || 'black',
                          opacity: 0,
                      }),
            }}
        />
    )
}

const TrueSpinner: FC<Omit<iSpinnerProps, 'type'>> = (props) => {
    return <Spinner type="spin" {...props} />
}

const PulsingSpinner: FC<Omit<iSpinnerProps, 'type'>> = (props) => {
    return <Spinner type="pulse" {...props} />
}

interface iSVGSpinnerProps {
    source: string
    className?: string
}

type iSVGSpinnerChildProps = Omit<iSVGSpinnerProps, 'source'>

const SVGSpinner: FC<iSVGSpinnerProps> = ({ source, className }) => {
    return <img src={source} alt="spinner" className={cn('size-8', className)} />
}

const BlocksShuffleSpinner: FC<iSVGSpinnerChildProps> = (props) => {
    return <SVGSpinner source="/components/spinners/blocks-shuffle.svg" {...props} />
}

const BlocksWaveSpinner: FC<iSVGSpinnerChildProps> = (props) => {
    return <SVGSpinner source="/components/spinners/blocks-wave.svg" {...props} />
}

const RingResizeSpinner: FC<iSVGSpinnerChildProps> = (props) => {
    return <SVGSpinner source="/components/spinners/ring-size.svg" {...props} />
}

const ThreeInOneSpinner: FC<iSVGSpinnerChildProps> = (props) => {
    return <SVGSpinner source="/components/spinners/three-in-one.svg" {...props} />
}

export {
    Spinner,
    BlocksShuffleSpinner,
    BlocksWaveSpinner,
    RingResizeSpinner,
    ThreeInOneSpinner,
    SVGSpinner,
    TrueSpinner,
    PulsingSpinner,
}
