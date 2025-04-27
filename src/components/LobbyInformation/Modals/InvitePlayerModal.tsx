import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { FiCopy } from 'react-icons/fi';
import { z } from 'zod';

import { toastError, toastInfo } from '@components/toastifications';
import {
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogInteractableArea,
    AlertDialogTitle,
} from '@components/ui/alert-dialog';
import { Button, ButtonWithTooltip } from '@components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form';
import { Input } from '@components/ui/input';
import { ScrollArea } from '@components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { useCurrentLobbyId } from '@hooks/useCurrentLobbyId';
import useCreateInviteCode from '@mutations/lobby-overview/useCreateInviteCode';
import useDeleteInviteCode from '@mutations/lobby-overview/useDeleteInviteCode';
import useLobbyInviteCodes from '@queries/profile/useLobbyInviteCodes';

interface iInvitePlayerModal {
    closeModal: () => void;
}

const validDays = (createdAt: Date, validUntil: Date) => {
    const Difference_In_Time = createdAt.getTime() - validUntil.getTime();
    return Math.abs(Math.round(Difference_In_Time / (1000 * 3600 * 24)));
};

const newInviteCodeSchema = z.object({
    max_uses: z.coerce.number().min(1).max(100).default(1),
    valid_for: z.enum(['1d', '2d', '3d', '5d', '7d']).default('1d'),
});

const InvitePlayerModal: FC<iInvitePlayerModal> = ({ closeModal }) => {
    'use no memo;';
    // https://github.com/react-hook-form/react-hook-form/issues/12298
    const { t } = useTranslation('local', {
        keyPrefix: 'lobby-info.players.invite-code-modal',
    });
    const lobbyId = useCurrentLobbyId();
    const { codes } = useLobbyInviteCodes();
    const form = useForm<z.infer<typeof newInviteCodeSchema>>({
        resolver: zodResolver(newInviteCodeSchema),
        defaultValues: {
            max_uses: 1,
            valid_for: '1d',
        },
        reValidateMode: 'onBlur',
    });
    const { deleteInviteCode, isPending: isPendingDeletion } = useDeleteInviteCode();
    const { createInviteCode, isPending: isPendingCreation } = useCreateInviteCode();

    const handleSubmit = (data: z.infer<typeof newInviteCodeSchema>) => {
        if (isPendingCreation || !lobbyId) return;
        createInviteCode({ lobbyId, data });
    };

    const handleCodeDeletion = (code: string) => {
        if (isPendingDeletion || !lobbyId) return;
        deleteInviteCode({ lobbyId, code });
    };

    return (
        <>
            <AlertDialogHeader className={'flex min-h-[400px] flex-col gap-4'}>
                <AlertDialogTitle className={'text-3xl'}>{t('title')}</AlertDialogTitle>
                <AlertDialogDescription>{t('description')}</AlertDialogDescription>
                <AlertDialogInteractableArea className={'grid grid-cols-1 gap-4 text-accent-foreground sm:grid-cols-2'}>
                    <div>
                        <p className={'text-base font-medium text-accent-foreground'}>{t('current-active-codes')}</p>
                        <ScrollArea className={'h-[250px]'}>
                            {codes && codes.length > 0 ? (
                                codes.map(({ code, createdAt, validUntil, uses, maxUses }) => (
                                    <div
                                        key={code}
                                        className={'flex justify-between space-x-2 rounded-md bg-secondary p-2 text-sm'}
                                    >
                                        <div className={'flex flex-row items-center gap-6'}>
                                            <p className={'font-medium'}>{code}</p>
                                            <p className={'text-muted-foreground'}>
                                                {t('days-left', { count: validDays(createdAt, validUntil) })}
                                            </p>
                                            <p className={'text-muted-foreground'}>
                                                {uses}/{maxUses}
                                            </p>
                                        </div>
                                        <div className={'flex flex-row items-center gap-2'}>
                                            <ButtonWithTooltip
                                                tooltip={t('copy-code-btn-tooltip')}
                                                tooltipClassname={'text-xs'}
                                                className={'size-8 p-1.5'}
                                                onClick={() => {
                                                    navigator.clipboard
                                                        .writeText(code)
                                                        .then(() => {
                                                            toastInfo(t('code-copied'));
                                                        })
                                                        .catch((e) => {
                                                            console.debug(e);
                                                            toastError(t('code-could-not-be-copied'));
                                                        });
                                                }}
                                                variant={'ghost'}
                                            >
                                                <FiCopy className={'inline-block'} />
                                            </ButtonWithTooltip>
                                            <ButtonWithTooltip
                                                tooltip={t('delete-code')}
                                                tooltipClassname={'text-xs'}
                                                className={'size-8 p-1.5'}
                                                variant={'destructiveGhost'}
                                                disabled={isPendingDeletion}
                                                onClick={() => handleCodeDeletion(code)}
                                            >
                                                <FaTrashAlt className={'inline-block text-red-500'} />
                                            </ButtonWithTooltip>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>{t('no-codes')}</p>
                            )}
                        </ScrollArea>
                    </div>
                    <div className={'flex flex-col gap-3'}>
                        <p className={'text-center text-base font-medium text-accent-foreground sm:text-left'}>
                            {t('create-new-code')}
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)} className={'flex flex-col gap-3'}>
                                <FormField
                                    name={'max_uses'}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('max-uses')}</FormLabel>
                                            <FormControl>
                                                <Input className={'w-full'} {...field} placeholder={'1'} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={'valid_for'}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('valid-for')}</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a verified email to display" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1d">{t('1d')}</SelectItem>
                                                    <SelectItem value="2d">{t('2d')}</SelectItem>
                                                    <SelectItem value="3d">{t('3d')}</SelectItem>
                                                    <SelectItem value="5d">{t('5d')}</SelectItem>
                                                    <SelectItem value="7d">{t('7d')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type={'submit'}
                                    className={'w-full'}
                                    disabled={!form.formState.isValid || isPendingCreation}
                                >
                                    <FaPlus className={'mr-2 inline-block'} />
                                    {t('create-new')}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </AlertDialogInteractableArea>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => closeModal()}>{t('close')}</AlertDialogCancel>
            </AlertDialogFooter>
        </>
    );
};

export default InvitePlayerModal;
