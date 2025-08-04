'use client';

import { FC, useEffect, useState } from "react";
import ProtectedRouteLayout from "@/app/components/common/ProtectedRouteLayout"
import AddStratergy from "@/app/components/Prompts/AddPrompt";
import EditStratergy from "@/app/components/Prompts/EditPrompt";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { selectLoading, selectStratergies, getAllStratergies, deleteStratergy } from "@/app/store/redux/pageSlice"
import Loading from "@/app/components/common/Loading";
import DeleteModal from "@/app/components/common/DeleteModal";
import { truncate } from "@/app/utils"

const Stratergies: FC = () => {
    const dispatch = useAppDispatch();

    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState<string>(null!);
    const [deleteOpen, setDeleteOpen] = useState<string>(null!);
    const loading = useAppSelector(selectLoading);
    const stratergies = useAppSelector(selectStratergies);

    useEffect(() => {
        dispatch(getAllStratergies());
    }, [])

    
    const onDelete = () => {
        dispatch(deleteStratergy(deleteOpen))
        setDeleteOpen(null!)
    }

    return (
        <ProtectedRouteLayout>
            {loading ?
                <Loading loading={loading} />
                :
                <div>
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                            <h1 className="text-base font-semibold">Stratergies</h1>
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                            <button
                                type="button"
                                className="cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={() => setAddOpen(true)}
                            >
                                Add Stratergy
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 flow-root">
                        <div className="overflow-x-auto">
                            <div className="inline-block min-w-full py-2 align-middle">
                                <div className="overflow-hidden">
                                    <table className="min-w-full divide-y-1 divide-gray-300">
                                        <thead className="">
                                            <tr>
                                                <th scope="col" className="py-3.5 pr-3 text-left text-sm font-semibold">
                                                    Name
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                                    Description
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                                                    Enabled
                                                </th>
                                                <th scope="col" className="pr-4 pl-3 py-3 sm:pr-6 text-right text-sm font-semibold">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-600">
                                            {stratergies.map((stratergy, idx) => (
                                                <tr key={idx}>
                                                    <td className="py-4 pr-3 text-sm font-medium">
                                                        {stratergy.name}
                                                    </td>
                    
                                                    <td className="px-3 py-4 text-sm ">{truncate(stratergy.shortDescription,100)}</td>

                                                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                                                        <div className="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out has-checked:bg-indigo-600 has-focus-visible:outline-2">
                                                            <span className="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out group-has-checked:translate-x-5"></span>
                                                            <input
                                                                type="checkbox"
                                                                className="absolute inset-0 appearance-none focus:outline-hidden"
                                                                id="isEnabled"
                                                                name="isEnabled"
                                                                aria-labelledby="availability-label"
                                                                aria-describedby="availability-description"
                                                                checked={stratergy.isEnabled}
                                                                disabled
                                                            />
                                                        </div>

                                                    </td>
                                                    <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                                                        <span onClick={() => setEditOpen(stratergy._id)} className="cursor-pointer text-indigo-600 hover:text-indigo-900 mr-2">
                                                            Edit
                                                        </span>

                                                        <span onClick={() => setDeleteOpen(stratergy._id)} className="cursor-pointer text-red-600 hover:text-red-900">
                                                            Delete
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <AddStratergy open={addOpen} setOpen={setAddOpen} />
            <EditStratergy incontextExampleId={editOpen} open={!!editOpen} setOpen={setEditOpen}  />
            <DeleteModal
                title="Delete Incontext Example"
                open={!!deleteOpen}
                setOpen={setDeleteOpen}
                onDelete={onDelete}
            />
        </ProtectedRouteLayout>
    )
}

export default Stratergies;