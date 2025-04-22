import { CurrentUserAvatar } from '@components/UserAvatars';
import { ButtonLink } from '@components/ui/button';
import { FC, ReactNode } from 'react';
import { LuSettings } from 'react-icons/lu';

interface iBannerBackground {
    children: ReactNode;
}

const BannerBackground: FC<iBannerBackground> = ({ children }) => {
    return (
        <div className="flex h-full w-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600">
            <div className="absolute inset-0 opacity-30">
                {/* Animated stars effect */}
                <div className="stars-container">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                width: `${Math.random() * 3 + 1}px`,
                                height: `${Math.random() * 3 + 1}px`,
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                opacity: Math.random() * 0.8 + 0.2,
                                animation: `twinkle ${Math.random() * 5 + 3}s infinite`,
                            }}
                        />
                    ))}
                </div>
            </div>
            {children}
        </div>
    );
};

const BannerFooter: FC<{ name: string }> = ({ name }) => {
    return (
        <div className="w-full items-end justify-between">
            <div className="relative flex h-full w-full items-end max-sm:flex-col max-sm:items-center">
                {/* Avatar */}
                <div className="absolute z-10">
                    <CurrentUserAvatar className="ml-6 h-[128px] w-[128px] rounded-full border-slate-900 shadow-none" />
                </div>

                {/* Username and title on compact dark background */}
                <div className="mt-16 inline-flex flex-col rounded-tr-3xl bg-background py-2 pl-44 pr-8 max-sm:mt-[138px] max-sm:flex-col max-sm:rounded-xl max-sm:px-6 max-sm:pl-6">
                    <h1 className="text-2xl font-bold">{name}</h1>
                    <p className="text-sm text-slate-400">Little Beta-Tester</p>
                </div>

                {/* Settings button outside the dark background */}
                <div className="ml-auto mt-16 rounded-tl-3xl bg-background px-4 py-4 pr-44">
                    <ButtonLink
                        to="/profile/settings"
                        variant="default"
                        size="sm"
                        className="border-slate-700 backdrop-blur-sm hover:bg-slate-500 hover:text-white"
                    >
                        <LuSettings className="mr-1 h-4 w-4" />
                        Settings
                    </ButtonLink>
                </div>
            </div>
        </div>
    );
};

interface iBanner {
    name: string;
}

const Banner: FC<iBanner> = ({ name }) => {
    return (
        <div className="relative h-48 w-full max-sm:h-56">
            <BannerBackground>
                <BannerFooter name={name} />
            </BannerBackground>
        </div>
    );
};

export default Banner;
