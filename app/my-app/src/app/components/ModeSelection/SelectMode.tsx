'use client'

import { FC, useState, useMemo } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import GameMode from './GameMode';
import StratergyMode from './StratergyMode';
import GameStratergyMode from './GameStratergyMode';

interface Props {
    setStartChat: (start: boolean) => void;
}

const SelectMode: FC<Props> = (props) => {
    const { setStartChat } = props;
    const [mode, setMode] = useState<string>("");

    const SelectComponent = useMemo(() => {
        if (mode === "Game") {
            return GameMode;
        }
        else if (mode === "Stratergy") {
            return StratergyMode;
        }
        else if (mode === "Game & Strategy") {
            return GameStratergyMode;
        }
    }, [mode]);

    const modes = ["Game", "Stratergy", "Game & Strategy"]


    return (
        <div className='items-center min-h-screen'>
            <div className='max-w-sm mx-auto '>
                <Listbox value={mode} onChange={setMode}>
                    <Label className="block text-large">Select Mode</Label>
                    <div className="relative mt-2">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-900 py-1.5 pr-2 pl-3 text-left sm:text-sm/6">
                            <span className="col-start-1 row-start-1 truncate pr-6">{mode}</span>
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end  sm:size-4"
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                        >
                            {modes.map((mode) => (
                                <ListboxOption
                                    key={mode}
                                    value={mode}
                                    className="group relative cursor-default py-2 pr-4 pl-8 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold">{mode}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>

                {SelectComponent && <SelectComponent />}

                <button
                    type="button"
                    className="mt-4 w-full cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setStartChat(true)}
                    disabled={!mode} // Disable if no prompt oe example is selected
                >
                    Start
                </button>
            </div>
        </div>
    )
}

export default SelectMode;