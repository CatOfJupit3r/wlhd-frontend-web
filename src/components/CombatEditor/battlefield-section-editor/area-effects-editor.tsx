import { useBattlefieldContext } from '@context/BattlefieldContext';
import { useCombatEditor } from '@context/combat-editor';
import { AreaEffectEditable } from '@type-defs/combat-editor-models';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RiAddBoxFill } from 'react-icons/ri';

import { AOECard } from '@components/GameScreen/aoe-effects-display';
import { AddNewComponent, AreaEffectEditor } from '@components/editors/game-component-editors';
import { Button, ButtonWithTooltip } from '@components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogInteractableArea,
    DialogTitle,
} from '@components/ui/dialog';
import { HorizontalSeparator } from '@components/ui/separator';

interface iAreaEffectsEditor {}

const AreaEffectsOnBattlefieldEditor: FC<iAreaEffectsEditor> = () => {
    const [modal, setModal] = useState<null | 'edit' | 'add'>(null);
    const [modalAOEIndex, setModalAOEIndex] = useState<number | null>(null);
    const { addAOEHighlight } = useBattlefieldContext();
    const { areaEffects, addAreaEffect, deleteAreaEffect, changeAreaEffect } = useCombatEditor();
    const { t } = useTranslation('local', {
        keyPrefix: 'editor.area-effects',
    });

    useEffect(() => {
        if (modal === null) {
            addAOEHighlight([]);
            return;
        }
        if (modal !== 'edit') return;
        if (modalAOEIndex !== null && areaEffects[modalAOEIndex]) {
            addAOEHighlight(areaEffects[modalAOEIndex].squares);
        } else {
            addAOEHighlight([]);
        }
    }, [areaEffects, modalAOEIndex, modal]);

    return (
        <Dialog open={modal !== null} onOpenChange={(value) => !value && setModal(null)}>
            <div className={'flex h-full w-20 flex-col justify-start gap-4'}>
                <div>
                    <ButtonWithTooltip
                        variant={'secondary'}
                        tooltip={t('add')}
                        tooltipClassname={'size-full'}
                        className={'w-full p-2.5'}
                        onClick={() => {
                            setModal('add');
                        }}
                    >
                        <RiAddBoxFill className={'text-sm'} />
                    </ButtonWithTooltip>
                </div>
                <HorizontalSeparator className={'h-1'} />
                <div>
                    {areaEffects.map((areaEffect, index) => {
                        return (
                            <AOECard
                                key={index}
                                effect={areaEffect}
                                className={'text-white'}
                                bonusTooltip={
                                    <div className={'mt-1 flex w-full flex-row gap-2 p-4'}>
                                        <Button
                                            variant={'destructive'}
                                            onClick={() => {
                                                deleteAreaEffect(index);
                                            }}
                                            className={'w-full'}
                                        >
                                            {t('remove')}
                                        </Button>
                                        <Button
                                            variant={'default'}
                                            className={'w-full'}
                                            onClick={() => {
                                                setModal('edit');
                                                setModalAOEIndex(index);
                                            }}
                                        >
                                            {t('edit')}
                                        </Button>
                                    </div>
                                }
                            />
                        );
                    })}
                </div>
            </div>
            <DialogContent className={'flex w-full max-w-3xl flex-col gap-4 rounded border-2 p-4'}>
                <DialogHeader>
                    <DialogTitle>{t(modal === 'add' ? 'add' : 'edit')}</DialogTitle>
                </DialogHeader>
                <DialogInteractableArea className={'flex w-full flex-row items-center gap-4'}>
                    {modal === 'add' ? (
                        <AddNewComponent
                            type={'areaEffect'}
                            onAdd={(areaEffect, descriptor) => {
                                addAreaEffect({
                                    ...(areaEffect as AreaEffectEditable),
                                    descriptor,
                                });
                                setModal(null);
                            }}
                            className={'max-h-3xl'}
                        />
                    ) : (
                        <AreaEffectEditor
                            component={areaEffects[modalAOEIndex ?? 0]}
                            setComponent={(areaEffect) => {
                                const oldAreaEffect = areaEffects[modalAOEIndex ?? 0];
                                changeAreaEffect(modalAOEIndex ?? 0, {
                                    ...areaEffect,
                                    descriptor: oldAreaEffect.descriptor,
                                });
                            }}
                            className={'max-h-[650px]'}
                        />
                    )}
                </DialogInteractableArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <ButtonWithTooltip
                            variant={'default'}
                            tooltip={t('close')}
                            tooltipClassname={'size-full'}
                            className={'w-full'}
                            onClick={() => setModal(null)}
                        >
                            {t(modal === 'add' ? 'close' : 'close-and-save')}
                        </ButtonWithTooltip>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AreaEffectsOnBattlefieldEditor;
