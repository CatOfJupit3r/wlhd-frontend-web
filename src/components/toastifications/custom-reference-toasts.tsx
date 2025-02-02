import { CustomReferenceToastFC } from '@components/toastifications/types';

export type InfoToastData = {
    title: string;
    message?: string;
};

const InfoToast: CustomReferenceToastFC<InfoToastData> = ({ data }) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <p className={'text-sm font-medium text-accent-foreground'}>{data?.title}</p>
            {data?.message ? <div>{data?.message}</div> : null}
        </div>
    );
};

export type ErrorToastData = {
    title: string;
    message?: string;
};

const ErrorToast: CustomReferenceToastFC<ErrorToastData> = ({ data }) => {
    return (
        <div className={'flex flex-col gap-2'}>
            <p className={'text-sm font-medium text-red-500'}>{data?.title}</p>
            {data?.message ? <div>{data?.message}</div> : null}
        </div>
    );
};

export { InfoToast, ErrorToast };
