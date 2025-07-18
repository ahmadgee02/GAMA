'use client'

import { FC, useState, useMemo } from 'react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectEnabledPrompts } from "@/app/store/redux/pageSlice"
import { Prompt } from '@/app/types';
import { selectPrompt, setPrompt, setMessageHistory } from "@/app/store/redux/chatSlice";

const SelectPrompt: FC = (props) => {
    const dispatch = useAppDispatch();
    const prompts = useAppSelector(selectEnabledPrompts);
    const prompt = useAppSelector(selectPrompt);

    const onChange = (selectedPrompt: Prompt) => {

        dispatch(
            setMessageHistory({
                role: "user",
                text: selectedPrompt.description,
                heading: "Prompt",
            })
        )

        dispatch(setPrompt(selectedPrompt));
    }

    return (
        <div className='items-center min-h-screen'>
            <div className='max-w-sm mx-auto '>
                <Listbox value={prompt} onChange={onChange}>
                    <Label className="block text-large">Select Prompt</Label>
                    <div className="relative mt-2">
                        <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-gray-900 py-1.5 pr-2 pl-3 text-left sm:text-sm/6">
                            <span className="col-start-1 row-start-1 truncate pr-6">{prompt?.name}</span>
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="col-start-1 row-start-1 size-5 self-center justify-self-end  sm:size-4"
                            />
                        </ListboxButton>

                        <ListboxOptions
                            transition
                            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-900 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                        >
                            {prompts.map((prompt) => (
                                <ListboxOption
                                    key={prompt._id}
                                    value={prompt}
                                    className="group relative cursor-default py-2 pr-4 pl-8 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold">{prompt.name}</span>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>
            </div>
        </div>
    )
}

export default SelectPrompt;