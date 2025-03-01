import { LayoutContextProvider, useLayoutContext } from '@context/LayoutContext';
import { apprf, cn } from '@utils';
import { FC, lazy, ReactNode, Suspense } from 'react';

const Header = lazy(() => import('@components/layout-manager/header'));
const Footer = lazy(() => import('@components/layout-manager/footer'));

const HeaderPlaceholder = () => (
    <div
        className={cn(
            'relative top-0 flex w-full justify-between bg-black p-4 text-xl text-white',
            apprf('max-[512px]', 'flex-col justify-center gap-3 bg-black p-4 text-center align-middle'),
        )}
    >
        Loading header...
    </div>
);

const FooterPlaceholder = () => (
    <footer className={'relative bottom-0 box-border block min-h-fit w-full justify-center bg-[#252525FF] p-8'}>
        <h1 className={'text-center text-xl font-bold text-[#d5d5d5]'}>
            By player, for players... and developers too!
        </h1>
        <div
            id={'footer-links'}
            className={cn(
                'mt-[1%] flex justify-center gap-[1%] text-base',
                apprf('max-[512px]', 'flex flex-col items-center justify-center gap-2'),
            )}
        >
            <div>Loading footer...</div>
        </div>
    </footer>
);

interface iLayoutManagerProps {
    children: ReactNode;
}

const LayoutManager: FC<iLayoutManagerProps> = ({ children }) => {
    const { footer, header } = useLayoutContext();

    return (
        <>
            {header && (
                <Suspense fallback={<HeaderPlaceholder />}>
                    <Header />
                </Suspense>
            )}
            <main>{children}</main>
            {footer && (
                <Suspense fallback={<FooterPlaceholder />}>
                    <Footer />
                </Suspense>
            )}
        </>
    );
};

export default ({ ...props }: iLayoutManagerProps) => {
    return (
        <LayoutContextProvider>
            <LayoutManager {...props} />
        </LayoutContextProvider>
    );
};
