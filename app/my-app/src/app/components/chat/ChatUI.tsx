import { useState, FC, useEffect } from 'react';
import ChatBox from './ChatBox';
import WebSocketHook from "@/app/hooks/WebSocketHook"
import { selectPrompt, selectIncontextExample, selectMessagesHistory, selectDescription, selectLoading, selectAgent } from '../../store/redux/chatSlice';
import { useAppSelector } from "@/app/store/hooks";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import CodeEditor from './CodeEditor';

const ChatScreen = () => {
    const loading = useAppSelector(selectLoading);
    const prompt = useAppSelector(selectPrompt);
    const example = useAppSelector(selectIncontextExample);
    const description = useAppSelector(selectDescription)
    const messages = useAppSelector(selectMessagesHistory);
    const agent = useAppSelector(selectAgent)
    // const messagesEndRef = useRef(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selected, setSelected] = useState(null! as any)

    const {
        authenticateConneection,
        sendPrompt,
        sendIncontextExample,
        sendDescription,
        sendEditCode,
        sendUserMove,
        saveAgentHistory
    } = WebSocketHook()

    useEffect(() => {
        if (prompt && example) {
            authenticateConneection();
            sendPrompt(prompt);
            sendIncontextExample(example);
        }
    }, [])

    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // }, [messages]);

    const listSelectFun = (selectedMove: any) => {
        sendUserMove(selectedMove)

        setSelected(selectedMove)
    }

    const saveAgent = () => {
       saveAgentHistory(messages)
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`max-w-2xl ${msg.role === "user"
                            ? "self-end ml-auto"
                            : "self-start"
                            }`}
                    >
                        <div className='ml-2'>{msg.heading}</div>
                        <div className='chat bg-gray-900 px-4 py-3 rounded-xl  whitespace-pre-wrap'>
                            {(typeof msg.text === "object") ? msg.text.join(", ") : msg.text}
                        </div>
                        {/* {
                            msg.role === Role.Agent ?
                                <AgentMessage
                                    message={msg}
                                    sendEditCode={sendEditCode}
                                    sendUserMove={sendUserMove}
                                />
                                :
                                <div className='chat bg-gray-900 px-4 py-3 rounded-xl  whitespace-pre-wrap'>
                                    {msg.text}
                                </div>
                        } */}
                    </div>
                ))}
                {loading && (
                    <div className=" flex justify-center items-center">
                        <div className="my-8 animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                    </div>
                )}
                {/* <div ref={messagesEndRef} /> */}
            </div>
            {!description || !agent &&
                <>
                    {/* Input Area */}
                    < div className="sticky bottom-0 p-4">
                        <ChatBox
                            sendDescription={sendDescription}
                            prompt={prompt}
                        />
                    </div>
                </>
            }
            {
                agent &&
                < div className="sticky bottom-0 p-4 w-full">
                    <div className="flex chatbox">
                        {/* <button
                            type="button"
                            className="mt-4 mr-2 cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => toggleExtraUtils()}
                        >

                            {showExtraUtils ? 'Close' : 'Show'} Extra Utils
                        </button> */}
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
                            onClick={saveAgent}
                        >
                            Save
                        </button>
                    </div>
                </div>
            }

            <CodeEditor
                isOpen={isEditMode}
                onCancel={() => setIsEditMode(false)}
                value={agent?.gameRules}
                onSave={sendEditCode}
            />
        </div>
    );
}

export default ChatScreen;