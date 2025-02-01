import DLCData, { iDLCData } from '@components/GameWiki/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@components/ui/card';
import StyledLink from '@components/ui/styled-link';
import paths from '@router/paths';
import { SUPPORTED_DLCS_DESCRIPTORS } from 'config';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface iDLCCard {
    title: string;
    description: string;
    creator: string;
}

const DLCCard: FC<iDLCCard> = ({ title, description, creator }) => {
    const { t } = useTranslation('local', { keyPrefix: 'wiki.dlcs' });

    return (
        <Card className={'h-full p-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-lg'}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className={'font-light italic'}>{description}</CardDescription>
            </CardContent>
            <CardFooter>
                {t('general.created-by', {
                    author: creator,
                })}
            </CardFooter>
        </Card>
    );
};

interface iWikiDLCChoice {}

const WikiDLCChoice: FC<iWikiDLCChoice> = () => {
    const { t } = useTranslation('local', { keyPrefix: 'wiki' });
    return (
        <div className={'mt-4 flex size-full justify-center'}>
            <div className={'flex w-full max-w-6xl flex-col justify-center gap-4'}>
                <div className={'w-full text-center'}>
                    <h1 className={'text-2xl font-bold'}>{t('choose-dlc')}</h1>
                </div>
                <div className={'flex flex-row justify-center gap-4'}>
                    {SUPPORTED_DLCS_DESCRIPTORS.map((dlc) => (
                        <StyledLink to={paths.wikiWithDLC.replace(':dlc', dlc)} className={'w-full no-underline'}>
                            <DLCCard
                                title={t(`dlcs.${dlc}.name`)}
                                description={t(`dlcs.${dlc}.description`)}
                                creator={DLCData[dlc as keyof iDLCData]?.creator ?? 'Unknown'}
                            />
                        </StyledLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WikiDLCChoice;
