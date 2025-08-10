'use client'

import { FC } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectStrategies, selectIncontextGameExamples } from "@/app/store/redux/pageSlice"
import { setIncontextExample, selectIncontextExample, selectPrompt, setPrompt } from "@/app/store/redux/chatSlice"
import { IncontextExample, Prompt } from '@/app/types';

const GameMode: FC = () => {
    const dispatch = useAppDispatch();
    const stratergies = useAppSelector(selectStrategies);
    const incontextGameExamples = useAppSelector(selectIncontextGameExamples);
    const selectedIncontextExample = useAppSelector(selectIncontextExample);
    const selectedPrompt = useAppSelector(selectPrompt);

    const onSelectIncontextExample = (example: IncontextExample) => {
        dispatch(setIncontextExample(example));
    }

    const onSelectPrompt = (prompt: Prompt) => {
        dispatch(setPrompt(prompt));
    }

    return (
            <>
                <Listbox value={selectedIncontextExample} onChange={onSelectIncontextExample} >
                    <Label className="block text-large mt-4">Select Incontext Game Example</Label>
                    <div className="relative mt-2">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-900 py-1.5 pr-2 pl-3 text-left sm:text-sm/6">
                            <span className="col-start-1 row-start-1 truncate pr-6">{selectedIncontextExample?.name}</span>
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end  sm:size-4"
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                        >
                            {incontextGameExamples.map((example) => (
                                <ListboxOption
                                    key={example._id}
                                    value={example}
                                    className="group relative cursor-default py-2 pr-4 pl-8 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold">{example.name}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>

                <Listbox value={selectedPrompt} onChange={onSelectPrompt}>
                    <Label className="block text-large mt-4">Select Stratergy</Label>
                    <div className="relative mt-2">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-900 py-1.5 pr-2 pl-3 text-left sm:text-sm/6">
                            <span className="col-start-1 row-start-1 truncate pr-6">{selectedPrompt?.name}</span>
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end  sm:size-4"
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                        >
                            {stratergies.map((stratergy) => (
                                <ListboxOption
                                    key={stratergy._id}
                                    value={stratergy}
                                    className="group relative cursor-default py-2 pr-4 pl-8 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold">{stratergy?.name}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>

        </>
    )
}

export default GameMode;