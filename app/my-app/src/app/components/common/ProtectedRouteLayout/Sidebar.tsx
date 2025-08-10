'use client';

import { FC, useEffect, useState } from 'react';
import {
    Dialog,
    DialogBackdrop,
    DialogPanel,
    TransitionChild,
} from '@headlessui/react';
import {
    Cog6ToothIcon,
    FolderIcon,
    HomeIcon,
    XMarkIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import { classNames } from "@/app/utils";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { getAllAgentsHistory, selectPrioritizedAgentHistory, deleteAgent, exportAgents } from '@/app/store/redux/pageSlice';
import { usePathname } from 'next/navigation'
import DeleteModal from "@/app/components/common/DeleteModal";

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Incontext Examples', href: '/incontext-examples', icon: FolderIcon },
    { name: 'Games', href: '/prompt/game', icon: FolderIcon },
    { name: 'Stratergies', href: '/prompt/stratergy', icon: FolderIcon },
    { name: 'Users', href: '/users', icon: FolderIcon }
];

interface Props {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Sidebar: FC<Props> = (props) => {
    const { sidebarOpen, setSidebarOpen } = props;
    const dispatch = useAppDispatch();
    const agentHistory = useAppSelector(selectPrioritizedAgentHistory);
    const pathname = usePathname()

    const [deleteOpen, setDeleteOpen] = useState<string>(null!);

    useEffect(() => {
        dispatch(getAllAgentsHistory())
    }, [])


    const onDelete = () => {
        dispatch(deleteAgent(deleteOpen))
        setDeleteOpen(null!)
    }

    const onTrashIconClick = (agentId: string) => {
        setSidebarOpen(false)
        setDeleteOpen(agentId)
    }

    return (
        <>
            <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
                <DialogBackdrop
                    transition
                    className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                />

                <div className="fixed inset-0 flex">
                    <DialogPanel
                        transition
                        className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
                    >
                        <TransitionChild>
                            <div className=" absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <XMarkIcon aria-hidden="true" className="cursor-pointer size-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>

                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4 ring-1 ring-white/10">
                            <div className="flex h-16 shrink-0 items-center">
                                <img
                                    alt="Your Company"
                                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                                    className="h-8 w-auto"
                                />
                            </div>
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map((item) => (
                                                <li key={item.name}>
                                                    <a
                                                        href={item.href}
                                                        className={classNames(
                                                            pathname === item.href
                                                                ? 'bg-gray-800 text-white'
                                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                        )}
                                                    >
                                                        <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                                        {item.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>

                                    <li>
                                        <div className="text-xs/6 font-semibold text-gray-400">Incorrect Agent History</div>
                                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                                            {agentHistory.map(({ _id, agentData }) => (
                                                <li key={_id} className='flex items-center justify-between'>
                                                    <a
                                                        href={`/agent/${_id}`}
                                                        className={classNames(
                                                            pathname === `/agents/${_id}`
                                                                ? 'bg-gray-800 text-white'
                                                                : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                        )}
                                                    >
                                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                            {agentData.name[0]}
                                                        </span>
                                                        <span className="truncate">{agentData.name}</span>
                                                    </a>
                                                    <TrashIcon onClick={() => onTrashIconClick(_id)} aria-hidden="true" className="ml-auto cursor-pointer size-6 shrink-0 flex-end" />
                                                </li>
                                            ))}
                                        </ul>
                                    </li>

                                    <li className="mt-auto">
                                        <a
                                            href="#"
                                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
                                        >
                                            <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                                            Settings
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col sidebar">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <img
                            alt="Your Company"
                            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                            className="h-8 w-auto"
                        />
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className={classNames(
                                                    pathname === item.href
                                                        ? 'bg-gray-800 text-white'
                                                        : 'hover:bg-gray-800 hover:text-white',
                                                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                )}
                                            >
                                                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <div className="text-xs/6 font-semibold">History</div>
                                <ul role="list" className="-mx-2 mt-2 space-y-1">
                                    {agentHistory.map(({ _id, agentData }) => (
                                        <li key={_id} className='flex items-center justify-between'>
                                            <a
                                                href={`/agents/${_id}`}
                                                className={classNames(
                                                    pathname === `/agents/${_id}`
                                                        ? 'bg-gray-800 text-white'
                                                        : 'hover:bg-gray-800 hover:text-white',
                                                    'group  flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                )}
                                            >
                                                <span className={`flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-${agentData.status === "correct" ? "gray" : "red"}-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white`}>
                                                    {agentData.name[0]}
                                                </span>
                                                <span className="truncate">{agentData.name}</span>
                                            </a>
                                            <TrashIcon onClick={() => onTrashIconClick(_id)} aria-hidden="true" className="ml-auto cursor-pointer size-6 shrink-0 flex-end" />
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <a
                                    href="#"
                                    onClick={()=> dispatch(exportAgents())}
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold hover:bg-gray-800 hover:text-white"
                                >
                                    <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                                    Export
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>

                <DeleteModal
                    title={`Delete Agent`}
                    open={!!deleteOpen}
                    setOpen={setDeleteOpen}
                    onDelete={onDelete}
                />
            </div>
        </>
    )
}


export default Sidebar;