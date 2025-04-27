import { useCombatEditor } from '@context/combat-editor';
import { useEffect, useState } from 'react';
import { MdTimer } from 'react-icons/md';

import { Input } from '@components/ui/input';

export const RoundHeader = () => {
    const { round, changeRound } = useCombatEditor();
    const [newRound, setNewRound] = useState(round);
    const [editable, setEditable] = useState(false);

    useEffect(() => {
        setNewRound(round);
    }, [round]);

    return (
        <div className={'flex flex-row items-center gap-1'}>
            <p className={'text-4xl text-white'}>
                <MdTimer />
            </p>
            {editable ? (
                <Input
                    className={`h-full w-[4ch] border-0 border-none border-transparent bg-transparent p-0 text-2xl font-bold text-secondary underline ring-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus-visible:ring-offset-transparent`}
                    value={parseInt(newRound.toString()).toString()}
                    placeholder={round.toString()}
                    type={'number'}
                    onBlur={() => {
                        changeRound(newRound);
                        setEditable(false);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            changeRound(newRound);
                            setEditable(false);
                        } else if (e.key === 'Escape') {
                            setNewRound(round);
                            setEditable(false);
                        }
                    }}
                    autoFocus
                    onFocus={(event) => {
                        const value = event.target.value;
                        event.target.value = '';
                        event.target.value = value;
                    }}
                    onInput={(e) => {
                        e.preventDefault();
                        if (e.currentTarget.value === '') {
                            setNewRound(0);
                            return;
                        }
                        const value = parseInt(e.currentTarget.value);
                        if (isNaN(value)) {
                            return;
                        } else if (value <= 0) {
                            setNewRound(0);
                        } else if (value > 999) {
                            setNewRound(999);
                            return;
                        } else {
                            setNewRound(parseInt(e.currentTarget.value));
                        }
                    }}
                />
            ) : (
                <p
                    className={'w-[4ch] cursor-pointer select-none text-2xl font-bold text-white'}
                    onDoubleClick={(e) => {
                        e.preventDefault();
                        setEditable(true);
                    }}
                >
                    {round}
                </p>
            )}
        </div>
    );
};
