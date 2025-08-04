import { Message } from "@/app/types";
import { FC, useMemo, useState } from "react";
import CodeEditor from "./CodeEditor";
import { Collapse } from 'react-collapse';
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'

interface Props {
    message: Message;
    sendEditCode: (code: string) => void; // Assuming this is a function to handle code editing
    sendUserMove: (move: string) => void;
}

const AgentMessage: FC<Props> = (props) => {
    const { message, sendEditCode, sendUserMove } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [showExtraUtils, setShowExtraUtils] = useState(false);
    const [selected, setSelected] = useState(null! as any)

    const toggleExtraUtils = () => {
        setShowExtraUtils(!showExtraUtils);
    }

    const { isStatusCorrect, moves } = useMemo(() => {
        if (message.data) {
            return {
                isStatusCorrect: message.data["status"] === "correct",
                moves: message.data["game_moves"].split(",") || []
            };
        }

        return {
            isStatusCorrect: false,
            moves: []
        }
    }, [message.data])

    console.log("isStatusCorrect", isStatusCorrect, message?.data?.["status"]);

    const listSelectFun = (selectedMove: any) => {
        console.log({ selectedMove })
        sendUserMove(selectedMove)

        setSelected(selectedMove)
    }

    return (
        <>
            <div className={`chat px-4 py-3 rounded-xl whitespace-pre-wrap border-2 border-${isStatusCorrect ? 'green' : 'red'}-800`}>
                {message.text}
            </div>

            <div className="flex ">
                <button
                    type="button"
                    className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => toggleExtraUtils()}
                >

                    {showExtraUtils ? 'Close' : 'Show'} Extra Utils
                </button>
                <button
                    type="button"
                    className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setIsEditMode(true)}
                >
                    Open Editor
                </button>

                <Listbox value={selected} onChange={listSelectFun}>
                    <div className="relative mt-4 mr-2">
                        <div className="inline-flex divide-x divide-indigo-700 rounded-md outline-hidden">
                            <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white">
                                <p className="text-sm font-semibold">Slecect User Move</p>
                            </div>
                            <ListboxButton className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-400">
                                <span className="sr-only">Change published status</span>
                                <ChevronDownIcon aria-hidden="true" className="size-5 text-white forced-colors:text-[Highlight]" />
                            </ListboxButton>
                        </div>

                        <ListboxOptions
                            transition
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0"
                        >
                            {moves?.map((option: string) => (
                                <ListboxOption
                                    key={option}
                                    value={option}
                                    className="group cursor-default p-4 text-sm text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white"
                                >
                                    <div className="flex flex-col">
                                        <div className="flex justify-between">
                                            <p className="font-normal group-data-selected:font-semibold">{option}</p>
                                            <span className="text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                                <CheckIcon aria-hidden="true" className="size-5" />
                                            </span>
                                        </div>
                                    </div>
                                </ListboxOption>
                            ))}
                        </ListboxOptions>
                    </div>
                </Listbox>

            </div>
            <Collapse isOpened={showExtraUtils}>
                {Object.keys(message.data || {}).map((key) =>
                    <div key={key} className="mt-4">
                        <div className='ml-2'>{key}</div>
                        <div className="chat bg-gray-900 px-4 py-3 rounded-xl  whitespace-pre-wrap">
                            {message?.data?.[key]}
                        </div>
                    </div>
                )}
            </Collapse>

            <CodeEditor
                isOpen={isEditMode}
                onCancel={() => setIsEditMode(false)}
                value={message.text}
                onSave={sendEditCode}
            />
        </>
    );
}

export default AgentMessage;