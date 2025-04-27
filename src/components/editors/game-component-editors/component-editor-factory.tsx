import React, { useCallback, useMemo } from 'react';
import { FaTags } from 'react-icons/fa';

import DescriptionWithMemories from '@components/InfoDisplay/DescriptionWithMemories';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { Label } from '@components/ui/label';
import { HorizontalSeparator } from '@components/ui/separator';
import useDualTranslation from '@hooks/useDualTranslation';
import { cn } from '@utils';

import {
    ActivenessEditor,
    AffectedSquaresEditor,
    AllowedEditables,
    CooldownEditor,
    CostEditor,
    CreateNewMemoryWithAccordion,
    DurationEditor,
    MemoriesEditor,
    QuantityEditor,
    TagsEditor,
    UsesEditor,
} from './common-editor-segments';

type ComponentEditorProps<T extends AllowedEditables> = {
    component: T;
    setComponent: (component: T) => void;
    canBeActivated?: (component?: T) => boolean;
    className?: string;
};

const ComponentEditorFactory = <T extends AllowedEditables>(type: string): React.FC<ComponentEditorProps<T>> => {
    const Created: React.FC<ComponentEditorProps<T>> = ({ component, setComponent, canBeActivated, className }) => {
        const { t } = useDualTranslation('local', { keyPrefix: 'editor' });

        const changeComponentField = useCallback(
            (key: string, value: AllowedEditables[keyof AllowedEditables]) => {
                setComponent({
                    ...component,
                    [key]: value,
                });
            },
            [component, setComponent],
        );

        const ActivenessSegment = useMemo(() => {
            if (!(type === 'weapon' || type === 'spell')) return null;
            return (
                <div className={'flex flex-row items-center gap-2'}>
                    <Label className={'flex flex-row gap-1'}>{t('shared.is-active')}</Label>
                    <ActivenessEditor
                        component={component}
                        changeComponentField={changeComponentField}
                        disabled={canBeActivated ? !canBeActivated(component) : true}
                    />
                </div>
            );
        }, [component, changeComponentField, t, type]);

        const QuantitySegment = useMemo(() => {
            if (!(type === 'item' || type === 'weapon')) return null;
            return <QuantityEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        const UsesSegment = useMemo(() => {
            if (!(type === 'item' || type === 'weapon' || type === 'spell')) return null;
            return <UsesEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        const CooldownSegment = useMemo(() => {
            if (!(type === 'item' || type === 'weapon' || type === 'spell')) return null;
            return <CooldownEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        const CostSegment = useMemo(() => {
            if (!(type === 'item' || type === 'weapon' || type === 'spell')) return null;
            return <CostEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        const DurationSegment = useMemo(() => {
            if (!(type === 'statusEffect' || type === 'areaEffect')) return null;
            return <DurationEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        const AffectedSquaresSegment = useMemo(() => {
            if (type !== 'areaEffect') return null;
            return <AffectedSquaresEditor component={component} changeComponentField={changeComponentField} />;
        }, [component, changeComponentField, t, type]);

        return (
            <div
                className={cn(
                    'border-container-medium relative flex w-full max-w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-3',
                    className,
                )}
            >
                <Accordion type={'single'} collapsible={true} defaultValue={'main-info'}>
                    <AccordionItem value={'main-info'}>
                        <AccordionTrigger>
                            <div
                                id={'main-info'}
                                className={'flex w-full flex-row justify-between overflow-hidden text-xl font-bold'}
                            >
                                <div className={'flex flex-row items-center gap-2'}>
                                    {t(component.decorations?.name, { includePrefix: false }) ?? '???'}
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            {ActivenessSegment}
                            <HorizontalSeparator />
                            <div id={'minor-info'} className={'flex flex-row justify-between text-base'}>
                                {AffectedSquaresSegment}
                                <div className={'flex flex-col gap-3'}>
                                    {QuantitySegment}
                                    {UsesSegment}
                                </div>
                                <div id={'type-details'} className={'flex flex-col gap-3'}>
                                    {DurationSegment}
                                    {CooldownSegment}
                                    {CostSegment}
                                </div>
                            </div>
                            <HorizontalSeparator />
                            <DescriptionWithMemories
                                memory={component.memory}
                                description={component.decorations?.description}
                                className={'break-words text-sm italic text-gray-400'}
                            />
                            <HorizontalSeparator />
                            <div className={'flex flex-col gap-3'}>
                                <Label className={'flex flex-row gap-1'}>
                                    <FaTags className={'inline-block'} />
                                    {t('tags.title')}
                                </Label>
                                <TagsEditor component={component} changeComponentField={changeComponentField} />
                            </div>
                            <HorizontalSeparator />
                            <div className={'flex flex-col gap-2'}>
                                <CreateNewMemoryWithAccordion
                                    component={component}
                                    changeComponentField={changeComponentField}
                                />
                                <MemoriesEditor component={component} changeComponentField={changeComponentField} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        );
    };
    Created.displayName = `${type}Editor`;
    return Created;
};

export type { ComponentEditorProps };
export default ComponentEditorFactory;
