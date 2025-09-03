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
import { classNames } from "@/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllAgentsHistory, selectPrioritizedAgentHistory, deleteAgent, exportAgents } from '@/store/redux/pageSlice';
import { usePathname } from 'next/navigation'
import DeleteModal from "@/components/common/DeleteModal";
import { isUserAdmin } from '@/store/redux/authSlice';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, adminPage: false },
    { name: 'Incontext Examples', href: '/incontext-examples', icon: FolderIcon, adminPage: false },
    { name: 'Games', href: '/prompt/game', icon: FolderIcon, adminPage: false },
    { name: 'Stratergies', href: '/prompt/stratergy', icon: FolderIcon, adminPage: false },
    { name: 'Users', href: '/users', icon: FolderIcon, adminPage: true }
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
    const isAdmin = useAppSelector(isUserAdmin)

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
                            <div className=" absolute top-0 right-0 z-10 flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                                    <span className="sr-only">Close sidebar</span>
                                    <XMarkIcon aria-hidden="true" className="cursor-pointer size-6 text-white" />
                                </button>
                            </div>
                        </TransitionChild>

                        <div className="flex grow flex-col gap-y-5 bg-gray-900 px-6 pb-4 ring-1 ring-white/10 relative h-[100vh]">
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
                                            {navigation.filter(item => isAdmin || !item.adminPage).map((item) => (
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
                                        <div className="text-xs/6 font-semibold text-gray-400">History</div>
                                        <ul role="list" className="-mx-2 mt-2 space-y-1 h-[calc(100vh-440px)] overflow-y-auto hide-scrollbar">
                                            {agentHistory.map(({ _id, agentData }) => (
                                                <li key={_id} className='flex items-center justify-between hover:bg-gray-800 hover:text-white pr-2 rounded'>
                                                    <a
                                                        href={`/agents/${_id}`}
                                                        className={classNames(
                                                            pathname === `/agents/${_id}`
                                                                ? 'bg-gray-800 text-white'
                                                                : 'text-gray-400 ',
                                                            'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                                                        )}
                                                    >
                                                        <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                                            {agentData.name[0]}
                                                        </span>
                                                        <span className="truncate">{agentData.name}</span>
                                                    </a>
                                                    {isAdmin && <TrashIcon onClick={() => onTrashIconClick(_id)} aria-hidden="true" className="ml-auto cursor-pointer size-6 shrink-0 flex-end" />}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>


                                </ul>

                                <div className="mt-auto absolute bottom-3 left-3 w-full">
                                    <a
                                        href="#"
                                        onClick={() => dispatch(exportAgents())}
                                        className="group w-full -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-400 bg-gray-900 hover:bg-gray-800 hover:text-white pr-2 rounded"
                                    >
                                        <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                                        Export
                                    </a>
                                </div>
                            </nav>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col sidebar">
                <div className="flex grow flex-col gap-y-5 h-[100vh] px-6 pb-4">
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
                                    {navigation.filter(item => isAdmin || !item.adminPage).map((item) => (
                                        <li key={item.name} className='flex justify-between items-center hover:bg-gray-800 hover:text-white pr-2 rounded'>
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
                                <ul role="list" className="-mx-2 mt-2 space-y-1 h-[calc(100vh-440px)] overflow-y-auto hide-scrollbar">
                                    {agentHistory.map(({ _id, agentData }) => (
                                        <li key={_id} className='flex items-center justify-between hover:bg-gray-800 hover:text-white pr-2 rounded'>
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
                                            {isAdmin && <TrashIcon onClick={() => onTrashIconClick(_id)} aria-hidden="true" className="ml-auto cursor-pointer size-6 shrink-0 flex-end" />}
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            <div className="mt-auto">
                                <a
                                    href="#"
                                    onClick={() => dispatch(exportAgents())}
                                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold hover:bg-gray-800 hover:text-white"
                                >
                                    <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                                    Export
                                </a>
                            </div>

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