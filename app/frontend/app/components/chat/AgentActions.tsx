import { FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import { selectAgent, selectAgentLoaded, setAgentLoaded } from "@/store/redux/chatSlice";
import { useParams } from 'next/navigation'

interface Props {
    setIsSaveAgentOpen: (open: boolean) => void;
    setIsEditMode: (editMode: boolean) => void;
    sendUserMove: (move: string) => void;
    loadAgent: (agentId: string) => void;
}

const AgentActions: FC<Props> = (props) => {
    const { setIsSaveAgentOpen, setIsEditMode, sendUserMove, loadAgent } = props;
    const dispatch = useAppDispatch();

    const agentLoaded = useAppSelector(selectAgentLoaded);
    const agent = useAppSelector(selectAgent);
    const { slug } = useParams();

    const [selected, setSelected] = useState(null! as any); // try to remove this


    const listSelectFun = (selectedMove: any) => {
        sendUserMove(selectedMove)

        setSelected(selectedMove)
    }

    const onClickLoadAgent = () => {
        loadAgent(slug?.toString() || "")
        dispatch(setAgentLoaded(true))
    }

    if (!agent) {
        return null!
    }

    return (
        <div className="sticky bottom-0 p-4 w-full">
            <div className="flex chatbox">
                {agentLoaded ?
                    <>
                        <button
                            type="button"
                            className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => setIsEditMode(true)}
                        >
                            Open Editor
                        </button>

                        <Listbox value={selected} onChange={listSelectFun}>
                            <div className="relative mt-4 mr-2">
                                <ListboxButton className="inline-flex divide-x divide-indigo-700 rounded-md outline-hidden">
                                    <div className="inline-flex items-center gap-x-1.5 rounded-l-md bg-indigo-600 px-3 py-2 text-white">
                                        <p className="text-sm font-semibold">Select User Move</p>
                                    </div>
                                    <div className="inline-flex items-center rounded-l-none rounded-r-md bg-indigo-600 p-2 hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-400">
                                        <ChevronDownIcon aria-hidden="true" className="size-5 text-white forced-colors:text-[Highlight]" />
                                    </div>
                                </ListboxButton>

                                <ListboxOptions
                                    transition
                                    className="absolute bottom-10 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0"
                                >
                                    {agent.gameMoves?.map((option: string) => (
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
                        <button
                            type="button"
                            className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => setIsSaveAgentOpen(true)}
                        >
                            Save
                        </button>
                    </>
                    :
                    <>
                        <button
                            type="button"
                            className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={onClickLoadAgent}
                        >
                            Load Agent
                        </button>
                    </>
                }
            </div>
        </div>
    )
}




export default AgentActions;